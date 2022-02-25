# Love open-source, dev-tooling and passionate about code as much as we do?
# ---
# We're always looking for awesome hackers like you to join our 100% remote team!
# Check and see if you find any relevant position @ https://appwrite.io/company/careers
# (and let us know you found this message...)

# This script contains hidden JS code to allow better readability and syntax highlighting
# You can use "View source" of this page to see the full script.

# REPO
$GITHUB_REPOSITORY_NAME = "appwrite/sdk-for-cli"

# Appwrite CLI location
$APPWRITE_INSTALL_DIR = New-Item -Path "$($env:LOCALAPPDATA)\Appwrite" -Type Directory -Force


function Greeting {
    Write-Host @"
    _                           _ _          ___   __   _____ 
   /_\  _ __  _ ___      ___ __(_) |_ ___   / __\ / /   \_   \
  //_\\| '_ \| '_\ \ /\ / / '__| | __/ _ \ / /   / /     / /\/
 /  _  \ |_) | |_)\ V  V /| |  | |  |  __// /___/ /___/\/ /_  
 \_/ \_/ .__/| .__/\_/\_/ |_|  |_|\__\___|\____/\____/\____/  
       |_|   |_|                                                  
 
"@ -ForegroundColor red
    Write-Host " 🔥 Welcome to the Appwrite CLI install shield 🛡 "
}

function CheckSystemInfo {
    Write-Host "[1/4] Getting System Info ..."
    if ((Get-ExecutionPolicy) -gt 'RemoteSigned' -or (Get-ExecutionPolicy) -eq 'ByPass') {
        Write-Host "PowerShell requires an execution policy of 'RemoteSigned'."
        Write-Host "To make this change please run:"
        Write-Host "'Set-ExecutionPolicy RemoteSigned -scope CurrentUser'"
        break
    }
}

function DownloadBinary {
    Write-Host "[2/4] Downloading Appwrite CLI binary ..."
    Write-Host "🚦 Fetching latest version ... " -ForegroundColor green

    $URL = "https://github.com/$GITHUB_REPOSITORY_NAME/releases/latest"

    Invoke-WebRequest -Uri $URL -OutFile $APPWRITE_INSTALL_DIR\appwrite.zip -UseJson true
}

function Install {
    Write-Host "[3/4] Starting installation ..."

}

function CleanUp {
    Write-Host "Cleaning up mess ..."
}

function InstallCompleted {
    Write-Host "[4/4] Finishing Installation ... "
    cleanup
    Write-Host "🤘 May the force be with you."
    Write-Host "To get started with Appwrite CLI, please visit https://appwrite.io/docs/command-line"
}


Greeting
CheckSystemInfo
DownloadBinary
Install
CleanUp
InstallCompleted