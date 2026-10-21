# NEXGUARD

**On-device notification health monitor for Android.**

NEXGUARD records notification events that Android delivers to your phone, checks the local settings that can block apps in the background, and shows phone-brand guidance for the settings you can change. History and preferences stay on the device.

NEXGUARD cannot stop Android or a phone maker from killing other apps, restart a force-stopped app, or recover a notification that never reached the phone.

Current release: **1.0.3**. Free and open source under GPL-3.0-only.

## Features

These features are implemented in the current source:

- Records when a notification is posted or removed for the apps you choose.
- Stores a local history in a Room database, with a configurable retention period. The default is 7 days.
- Provides a clear-history action.
- Supports two privacy modes: metadata only, or metadata plus notification titles. Full message text is not stored.
- Checks notification-listener access and battery-optimization state.
- Shows manufacturer-specific guidance for Samsung, Xiaomi, OPPO/Realme, Vivo, OnePlus, Huawei, Motorola, and Pixel.
- Schedules diagnostic work again after reboot with WorkManager.
- Lets you exclude apps from monitoring.
- Includes language selection, theme settings, and an onboarding permission flow.
- Ships 25 language options. All text is translated, but the translations are machine-generated and not yet reviewed by native speakers.

## Tested on

OPPO CPH1909, ColorOS 5.2.1, Android 8.1.0.

## Screenshots

Screenshots of version 1.0.3 are on the project website.

WeChat QR: ![WeChat QR](docs/wechat-qr.png)

## Requirements

| Item | Value |
|---|---|
| Package | `io.github.web_coder_lab.nexguard` |
| Minimum Android | 8.0 (API 26) |
| Target / compile SDK | 36 |
| Notification access | Required for event recording |
| Network | Not used for upload. The app requests network-state access only to report connectivity in diagnostics. |

There is no account system, cloud sync, analytics SDK, or crash-reporting service in the app source.

## Installation

1. Download `NEXGUARD-1.0.3.apk` from the [GitHub Releases](https://github.com/web-coder-lab/nexguard/releases) page is published.
2. On the phone, allow installation from your browser or file manager if Android asks.
3. Open the APK and install it.
4. Open NEXGUARD and grant notification access when prompted.
5. Review battery guidance for your phone brand.

### Upgrade

Install the newer APK over the existing app. Android allows the upgrade when the signing certificate matches the installed copy.

If Android reports a signature mismatch, the installed copy was signed with a different key. Uninstalling the old copy is then required, and its local history will be removed. Do not uninstall unless you accept that loss.

### Verify the download

Compare the SHA-256 on the release page with the file you downloaded before installing.

Signing certificate SHA-256:

`ea104132b89fcb66aa04e1f8d7390712523c5fae544a8da7e781b085557db17c`

APK SHA-256 for 1.0.3: `8cee3237a24da75662ea4f147073bfb4b44293bdba94c038640fb1f26f3ff34d`

## Permissions

| Permission | Why it is requested |
|---|---|
| `POST_NOTIFICATIONS` | Shows the app's own diagnostic notices on Android 13 and later. |
| `RECEIVE_BOOT_COMPLETED` | Reschedules diagnostics after the phone restarts. |
| `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` | Opens the system screen where you can exempt NEXGUARD from battery limits. |
| `ACCESS_NETWORK_STATE` | Reads whether a network is available for the diagnostics screen. It is not used to upload data. |
| `VIBRATE` | Supports local alert feedback. |
| `QUERY_ALL_PACKAGES` | Lists installed apps so you can choose which ones to monitor. |
| Notification listener binding | Required by Android so the app can observe posted and removed notifications. |

## Privacy

- Notification history is stored in the app's local Room database.
- Preferences are stored in local DataStore.
- In the default privacy mode, the app stores metadata such as app, time, and event type.
- Titles are stored only if you explicitly choose that mode.
- Full notification message text is not stored.
- The app does not include an internet permission and does not send history to a server.
- Backup is disabled in the manifest.

## Background limits

Phone makers can still stop background work. NEXGUARD can detect some local restriction states and point you to the relevant settings, but it cannot override a manufacturer battery manager.

After a reboot, WorkManager is scheduled again. That does not guarantee that every other app will keep running.

## Build from source

Requirements:

- JDK 17
- Android SDK with platform 36 and build-tools 36.0.0
- The Gradle wrapper included in this repository

```bash
export ANDROID_HOME="$HOME/android-sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
chmod +x ./gradlew
./gradlew test lint assembleRelease
```

A signed release build also needs these environment variables:

- `KEYSTORE_PATH`
- `KEYSTORE_PASSWORD`
- `KEY_ALIAS`
- `KEY_PASSWORD`

Do not commit a keystore or passwords. `.gitignore` already excludes `*.jks`, `*.keystore`, `keystore.properties`, and `.env`.

## Testing

```bash
./gradlew test
./gradlew lint
./gradlew assembleRelease
```

Unit tests cover domain and preference logic. Instrumentation tests require a device or emulator and are not run by the default GitHub release job.

## Troubleshooting

- **No events recorded:** open Android notification access settings and enable NEXGUARD.
- **Events stop after reboot:** check battery restrictions for NEXGUARD and the apps you care about.
- **An app is missing from the list:** confirm it is installed and not excluded in NEXGUARD.
- **Install blocked:** allow the file source, then retry the official APK.
- **Build fails on a small machine:** the release workflow uses a GitHub-hosted runner. Local machines with less than about 4 GB RAM can fail during dexing.

## Known limitations

- NEXGUARD observes notifications Android already delivered. It cannot recover a notification that was dropped before delivery.
- It cannot force-start another app or defeat every vendor background restriction.
- Diagnostics are guidance, not a guarantee that a setting change will fix every missed alert.
- Manufacturer guidance is based on current known settings paths and can change with a phone update.

## Security

Report vulnerabilities by email to dickvoice734@gmail.com. Include the version, steps to reproduce, and impact. Do not open a public issue for an unfixed vulnerability, and do not include another person's notification content.

See [SECURITY.md](SECURITY.md).

## Bugs, features, and contributions

- Bugs and feature requests: https://github.com/web-coder-lab/nexguard/issues
- Pull requests are welcome for bug fixes, tests, and documentation.
- Keep changes focused. Do not add analytics, accounts, or network upload.

## Project layout

```text
app/src/main/java/io/github/web_coder_lab/nexguard/
  notification/     listener, diagnostics, alerts
  background/       reboot receiver and WorkManager
  data/             Room database and preferences
  domain/           models
  ui/               Compose screens
  localization/     interface strings
```

## Downloads

Official releases: https://github.com/web-coder-lab/nexguard/releases

The current release candidate is **v1.0.3**. The signed APK SHA-256 will be published with the GitHub Release after approval.

## Version history

- **1.0.3** — wording cleanup, 25 language options with machine-generated translations not yet reviewed by native speakers, system apps off by default for new installs, backup exclusions, About section.
- **1.0.2** — namespace cleanup, unused Google Services removal, documentation update.
- **1.0.1** — package name finalized and signed release published.
- **1.0.0** — first signed release.

## License

GPL-3.0-only. See [LICENSE](LICENSE).

## Author

Syed Muhammad Hussain Shah, Pakistan  
dickvoice734@gmail.com
