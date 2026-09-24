Add-Type -AssemblyName System.Drawing

$srcPath = (Get-Item 'public/images/himroots-logo.png').FullName
$srcImg = [System.Drawing.Image]::FromFile($srcPath)

function Resize-Image($img, $width, $height, $outPath) {
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $destImage = New-Object System.Drawing.Bitmap($width, $height)
    $destImage.SetResolution($img.HorizontalResolution, $img.VerticalResolution)
    $graphics = [System.Drawing.Graphics]::FromImage($destImage)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $graphics.DrawImage($img, $destRect, 0, 0, $img.Width, $img.Height, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.Dispose()
    
    $destImage.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destImage.Dispose()
}

Resize-Image $srcImg 16 16 'public/favicon-16x16.png'
Resize-Image $srcImg 32 32 'public/favicon-32x32.png'
Resize-Image $srcImg 32 32 'public/favicon.png'
Resize-Image $srcImg 48 48 'public/favicon-48x48.png'
Resize-Image $srcImg 180 180 'public/apple-touch-icon.png'
Resize-Image $srcImg 192 192 'public/android-chrome-192x192.png'
Resize-Image $srcImg 512 512 'public/android-chrome-512x512.png'

# Also generate proper multi-resolution favicon.ico containing 16x16, 32x32, 48x48
# In .NET we can convert a 32x32 / 48x48 bitmap directly to an Icon
$icoBmp = New-Object System.Drawing.Bitmap('public/favicon-32x32.png')
$hIcon = $icoBmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = New-Object System.IO.FileStream('public/favicon.ico', [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
$icon.Dispose()
$icoBmp.Dispose()

$srcImg.Dispose()
Write-Host "Favicons generated successfully from public/images/himroots-logo.png"
