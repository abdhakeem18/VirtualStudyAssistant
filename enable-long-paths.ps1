# This script enables Windows Long Path support
# Run this file as Administrator by right-clicking and selecting "Run as Administrator"

Write-Host "Enabling Windows Long Path Support..." -ForegroundColor Yellow

try {
    New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
                     -Name "LongPathsEnabled" `
                     -Value 1 `
                     -PropertyType DWORD `
                     -Force | Out-Null
    
    Write-Host "`n✓ Long Path support has been enabled successfully!" -ForegroundColor Green
    Write-Host "`nIMPORTANT: You must RESTART your computer for this change to take effect." -ForegroundColor Red
    Write-Host "`nAfter restarting, you can build the APK by running:" -ForegroundColor Cyan
    Write-Host '  cd "D:\my files\BSC\individual project\VirtualStudyAssistant\android"' -ForegroundColor White
    Write-Host '  .\gradlew.bat assembleRelease' -ForegroundColor White
    
    $restart = Read-Host "`nWould you like to restart now? (Y/N)"
    if ($restart -eq 'Y' -or $restart -eq 'y') {
        Write-Host "`nRestarting computer in 10 seconds... Press Ctrl+C to cancel" -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        Restart-Computer -Force
    }
} catch {
    Write-Host "`n✗ Failed to enable long paths. Error: $_" -ForegroundColor Red
    Write-Host "`nMake sure you are running this script as Administrator!" -ForegroundColor Yellow
    Write-Host "Right-click the script and select 'Run as Administrator'" -ForegroundColor Yellow
}

Read-Host "`nPress Enter to exit"
