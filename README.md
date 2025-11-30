Roberto AI WordPress Plugin

Lightweight WordPress plugin scaffold integrating AI features for front-end and admin interactions.

## Summary

This repository contains a small WordPress plugin scaffold named `roberto-ai-wp`. It provides admin and frontend integration points and a REST entry file for AI-related endpoints. Use this README to install, develop, and contribute.

## Features

- Admin UI hooks and settings (`includes/admin.php`)
- Frontend integration and enqueueing assets (`includes/frontend.php`, `assets/`)
- REST endpoint(s) boilerplate (`includes/rest.php`)
- Main plugin entry file: `roberto-ai.php`

## Requirements

- WordPress 5.8+ (or later)
- PHP 7.4+ recommended

## Installation

1. Copy the plugin folder into your WordPress plugins directory:

```bash
# from repository root
cp -R . /path/to/wordpress/wp-content/plugins/roberto-ai-wp
```

2. Or zip the folder and upload via the WordPress admin Plugins → Add New → Upload Plugin.

3. Activate the plugin in the WordPress admin.

## Usage

- Check the WordPress admin area for plugin settings (if implemented in `includes/admin.php`).
- Frontend script and styles are in `assets/js` and `assets/css` and are enqueued via `includes/frontend.php`.
- REST endpoints are defined in `includes/rest.php`. Inspect that file to learn the available routes and expected request payloads.

Example: If a REST namespace is registered as `roberto-ai/v1`, a route may be available under:

```
/wp-json/roberto-ai/v1/<route>
```

## Development

- Edit PHP files in `includes/` for server-side logic.
- Edit assets in `assets/js/` and `assets/css/` for frontend behavior and styling.
- Use your local WP development environment (Local by Flywheel, WP-CLI, XAMPP, MAMP, etc.) to test.

Quick local activation using WP-CLI:

```bash
# install plugin (if zipped)
wp plugin install roberto-ai-wp.zip --activate

# or if already copied into plugins dir
wp plugin activate roberto-ai-wp
```

## File Structure

- `roberto-ai.php` - plugin entry file
- `includes/` - server-side includes
  - `admin.php` - admin hooks and settings
  - `frontend.php` - enqueue assets and frontend hooks
  - `rest.php` - register REST routes and handlers
- `assets/` - css and js files

## Contributing

Contributions are welcome. Please open an issue first to discuss larger changes. For small fixes, submit a pull request with a clear description and tests where applicable.

## Troubleshooting

- If the plugin does not appear in the Plugins list, ensure the folder name is `roberto-ai-wp` and the main plugin header is present in `roberto-ai.php`.
- Check `wp-content/debug.log` (enable `WP_DEBUG` and `WP_DEBUG_LOG`) for PHP errors.

## License

Specify your license here (e.g., MIT) or add a `LICENSE` file.

---

If you'd like, I can also:

- Add a short example of a REST request/response based on `includes/rest.php`.
- Commit the README and push a branch for review.
