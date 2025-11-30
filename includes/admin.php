<?php
if (!defined('ABSPATH')) {
    exit;
}

function roberto_ai_register_settings() {
    // Register new option names and accept old keys for backward compatibility
    register_setting('roberto_ai_options', 'roberto_ai_enabled');
    register_setting('roberto_ai_options', 'roberto_ai_position_bottom');
    register_setting('roberto_ai_options', 'roberto_ai_position_right');
    register_setting('roberto_ai_options', 'roberto_ai_api_secret');
}
add_action('admin_init', 'roberto_ai_register_settings');

function roberto_ai_menu() {
    add_options_page(
        __('Roberto AI', 'roberto-ai'),
        __('Roberto AI', 'roberto-ai'),
        'manage_options',
        'roberto-ai-settings',
        'roberto_ai_settings_page'
    );
}
add_action('admin_menu', 'roberto_ai_menu');

function roberto_ai_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    ?>
    <div class="wrap">
        <h1><?php esc_html_e('Roberto AI Settings', 'roberto-ai'); ?></h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('roberto_ai_options');
            do_settings_sections('roberto_ai_options');
            ?>
            <table class="form-table" role="presentation">
                <tbody>
                    <tr>
                        <th scope="row"><label for="roberto_ai_enabled"><?php esc_html_e('Enable Roberto AI', 'roberto-ai'); ?></label></th>
                        <td>
                            <?php $enabled = get_option('roberto_ai_enabled', '1'); ?>
                            <input type="checkbox" id="roberto_ai_enabled" name="roberto_ai_enabled" value="1" <?php checked('1', $enabled); ?> />
                        </td>
                    </tr>

                    <tr>
                        <th scope="row"><label for="roberto_ai_position_bottom"><?php esc_html_e('Position bottom (px)', 'roberto-ai'); ?></label></th>
                        <td>
                            <?php $pos_bottom = get_option('roberto_ai_position_bottom', 90); ?>
                            <input type="number" id="roberto_ai_position_bottom" name="roberto_ai_position_bottom" value="<?php echo esc_attr($pos_bottom); ?>" />
                            <p class="description"><?php esc_html_e('The distance from the bottom of the page to the button.', 'roberto-ai'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row"><label for="roberto_ai_position_right"><?php esc_html_e('Position right (px)', 'roberto-ai'); ?></label></th>
                        <td>
                            <?php $pos_right = get_option('roberto_ai_position_right', 40); ?>
                            <input type="number" id="roberto_ai_position_right" name="roberto_ai_position_right" value="<?php echo esc_attr($pos_right); ?>" />
                            <p class="description"><?php esc_html_e('The distance from the right of the page to the button.', 'roberto-ai'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row"><label for="roberto_ai_api_secret"><?php esc_html_e('OpenAI API Secret', 'roberto-ai'); ?></label></th>
                        <td>
                            <?php $api_secret = get_option('roberto_ai_api_secret', ''); ?>
                            <input type="text" id="roberto_ai_api_secret" name="roberto_ai_api_secret" value="<?php echo esc_attr($api_secret); ?>" style="width:60%" />
                            <p class="description"><?php esc_html_e('Set your OpenAI API key used by Roberto AI. Stored in options table. Keep private.', 'roberto-ai'); ?></p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}
