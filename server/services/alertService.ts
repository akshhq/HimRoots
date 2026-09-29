import { logger } from '../lib/logger';
import { config } from '../config/env';

export interface CriticalAlertPayload {
  title: string;
  message: string;
  severity: 'WARNING' | 'ERROR' | 'CRITICAL';
  orderId?: string;
  orderNumber?: string;
  error?: string | Error;
  context?: Record<string, any>;
}

/**
 * Dispatches an immediate incident alert for payment verification failures,
 * webhook processing errors, or critical email delivery collapses.
 *
 * Integrates with Slack, Discord, or generic incident webhook URLs via ALERT_WEBHOOK_URL.
 * Runs non-blocking with an internal 4-second timeout.
 */
export async function sendCriticalAlert(payload: CriticalAlertPayload): Promise<void> {
  const errorMessage =
    payload.error instanceof Error
      ? `${payload.error.message}\n${payload.error.stack || ''}`
      : typeof payload.error === 'string'
      ? payload.error
      : 'Unknown Error';

  // 1. Always record in structured error logs with full context (secrets redacted)
  logger.error(
    {
      alertTitle: payload.title,
      alertSeverity: payload.severity,
      orderId: payload.orderId,
      orderNumber: payload.orderNumber,
      errorDetail: errorMessage,
      context: payload.context,
    },
    `🚨 [CRITICAL ALERT] ${payload.title}: ${payload.message}`
  );

  // 2. Dispatch to external webhook if configured
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (!webhookUrl) {
    // In dev or when no webhook is configured, log an alert banner
    if (config.nodeEnv !== 'test') {
      logger.warn(
        { orderNumber: payload.orderNumber },
        `ALERT_WEBHOOK_URL not set in environment. External incident alert skipped for: ${payload.title}`
      );
    }
    return;
  }

  try {
    const isSlack = webhookUrl.includes('hooks.slack.com');
    const isDiscord = webhookUrl.includes('discord.com/api/webhooks');

    let bodyPayload: any;
    const formattedText = `*[Himroots ${payload.severity}]* ${payload.title}\n*Details:* ${payload.message}\n*Order:* ${payload.orderNumber || payload.orderId || 'N/A'}\n*Env:* ${config.nodeEnv}\n*Time:* ${new Date().toISOString()}${errorMessage ? `\n\`\`\`${errorMessage.slice(0, 300)}\`\`\`` : ''}`;

    if (isSlack) {
      bodyPayload = { text: formattedText };
    } else if (isDiscord) {
      bodyPayload = { content: formattedText };
    } else {
      bodyPayload = {
        title: payload.title,
        message: payload.message,
        severity: payload.severity,
        orderId: payload.orderId,
        orderNumber: payload.orderNumber,
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
        error: errorMessage.slice(0, 500),
        context: payload.context,
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.warn(
        { status: response.status, statusText: response.statusText },
        'External alert webhook returned non-2xx status code'
      );
    }
  } catch (err: any) {
    logger.warn({ error: err.message }, 'Failed to dispatch external incident alert notification');
  }
}
