# PowerShell script to rename HKTD images
Set-Location "c:\Users\andre\Documents\GitHub\drewfolio.me\images\Gallery\hktdc"

$renames = @(
    @{OldName="hktdc.jpg"; NewName="1.jpg"},
    @{OldName="hktdc2.jpg"; NewName="2.jpg"},
    @{OldName="hktdc3.jpg"; NewName="3.jpg"},
    @{OldName="hktdc4.jpg"; NewName="4.jpg"},
    @{OldName="hktdc5.jpg"; NewName="5.jpg"}
)

foreach ($rename in $renames) {
    try {
        Rename-Item -Path $rename.OldName -NewName $rename.NewName -Force
        Write-Host "Successfully renamed $($rename.OldName) to $($rename.NewName)"
    } catch {
        Write-Host "Failed to rename $($rename.OldName): $($_.Exception.Message)"
    }
}

Write-Host "Renaming process complete!"