# Run this after closing Cursor so project files are not locked.
# Creates: Desktop\bragaBazaar-modified.zip

$project = "c:\Users\mrbra\Desktop\bragaBazaar"
$zipPath = "c:\Users\mrbra\Desktop\bragaBazaar-modified.zip"

Set-Location $project
Compress-Archive -Path * -DestinationPath $zipPath -Force
Write-Host "Created: $zipPath"
Read-Host "Press Enter to close"
