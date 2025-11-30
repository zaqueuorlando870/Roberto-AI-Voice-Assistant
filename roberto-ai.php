<?php
/*
Plugin Name: Roberto AI
Plugin URI: https://orlandowebdev.com
Description: Roberto AI — voice assistant and search for your WordPress site (ported from Botble CMS plugin).
Version: 1.0.0
Author: Zaqueu Orlando
Text Domain: roberto-ai
Domain Path: /languages
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

define('ROBERTO_AI_PLUGIN_DIR', __DIR__);
define('ROBERTO_AI_PLUGIN_URL', plugin_dir_url(__FILE__));


// Includes
require_once ROBERTO_AI_PLUGIN_DIR . '/includes/frontend.php';
require_once ROBERTO_AI_PLUGIN_DIR . '/includes/admin.php';
require_once ROBERTO_AI_PLUGIN_DIR . '/includes/rest.php';

// Enqueue assets
function roberto_ai_enqueue_assets() {
    // CSS
    wp_register_style('roberto-ai-style', ROBERTO_AI_PLUGIN_URL . 'assets/css/style.css', [], '1.0.0');
    wp_enqueue_style('roberto-ai-style');

    // Add dynamic inline style for positioning from settings (migrate/accept old keys)
    $bottom = (int) get_option('roberto_ai_position_bottom', 90);
    $right = (int) get_option('roberto_ai_position_right', 40);
    $inline_css = ":root{} .voice-button{ bottom: " . esc_attr($bottom) . "px !important; right: " . esc_attr($right) . "px !important; }";
    wp_add_inline_style('roberto-ai-style', $inline_css);

    // annyang CDN
    wp_register_script('annyang', 'https://cdnjs.cloudflare.com/ajax/libs/annyang/2.6.1/annyang.min.js', [], '2.6.1', true);
    wp_register_script('roberto-ai-script', ROBERTO_AI_PLUGIN_URL . 'assets/js/script.js', ['annyang'], '1.0.0', true);

    // Localize script with REST URL and nonce
    wp_localize_script('roberto-ai-script', 'robertoAiData', [
        'rest_url' => esc_url_raw(rest_url('roberto-ai/v1')),
        'nonce'    => wp_create_nonce('wp_rest'),
    ]);

    wp_enqueue_script('roberto-ai-script');
}
add_action('wp_enqueue_scripts', 'roberto_ai_enqueue_assets');

// Auto-render the button in the footer when enabled (so you don't need to add the shortcode)
function roberto_ai_maybe_print_button() {
    $enabled = get_option('roberto_ai_enabled', '1');
    if ($enabled === '1' || $enabled === 1) {
        echo do_shortcode('[roberto_ai]');
    }
}
add_action('wp_footer', 'roberto_ai_maybe_print_button', 20);

// Register shortcodes (compatibility)
add_shortcode('roberto_ai', 'roberto_ai_render_button');

// Activation / Deactivation cleanup and migration
function roberto_ai_activate() {
    // Ensure Roberto AI options exist with safe defaults
    if (get_option('roberto_ai_enabled', null) === null) {
        add_option('roberto_ai_enabled', '1');
    }
    if (get_option('roberto_ai_position_bottom', null) === null) {
        add_option('roberto_ai_position_bottom', '90');
    }
    if (get_option('roberto_ai_position_right', null) === null) {
        add_option('roberto_ai_position_right', '40');
    }
    if (get_option('roberto_ai_api_secret', null) === null) {
        add_option('roberto_ai_api_secret', '');
    }
}
register_activation_hook(__FILE__, 'roberto_ai_activate');

function roberto_ai_deactivate() {
    // No legacy cleanup here — plugin deactivation leaves Roberto AI options
}
register_deactivation_hook(__FILE__, 'roberto_ai_deactivate');
