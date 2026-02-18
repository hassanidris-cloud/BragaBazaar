# Create bragaBazaar-modified.zip

To get a zip of the project **with all modifications**, use one of these methods.

## Option 1: After closing Cursor (recommended)

1. Close Cursor (and any other app that has project files open).
2. Open **File Explorer** and go to `Desktop\bragaBazaar`.
3. Select all files and folders **except** `node_modules` and `.git` (Ctrl+Click to deselect them if needed).
4. Right-click → **Send to** → **Compressed (zipped) folder**.
5. Name the new file `bragaBazaar-modified.zip`.
6. Move the zip to your Desktop or wherever you need it.

## Option 2: PowerShell (run after closing Cursor)

1. Close Cursor.
2. Right-click **Start** → **Windows PowerShell** (or **Terminal**).
3. Run:

```powershell
cd $env:USERPROFILE\Desktop\bragaBazaar
Compress-Archive -Path * -DestinationPath $env:USERPROFILE\Desktop\bragaBazaar-modified.zip -Force
```

The zip will be created on your Desktop as `bragaBazaar-modified.zip`.

**Note:** If you see "file is being used by another process", close every app that might have the folder open (Cursor, VS Code, OneDrive, etc.) and try again.
