<?php
if (!defined('ABSPATH')) {
    exit;
}

function roberto_ai_render_button($atts = [])
{
    $enabled = get_option('roberto_ai_enabled', '1');
    if ($enabled !== '1' && $enabled !== 1) {
        return ''; // disabled
    }

    ob_start();
?>
    <div id="fob-back2top">
        <div id="roberto-ai-app">
            <button class="voice-button" id="supportBtn" onclick="toggleVoiceAssistant(event)" data-roberto-action="toggle">
                <svg class="mic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="2" width="6" height="12" rx="3" ry="3" fill="white" stroke="none" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" fill="none" />
                    <line x1="12" y1="19" x2="12" y2="22" stroke="white" />
                    <line x1="8" y1="22" x2="16" y2="22" stroke="white" />
                    <path d="M7 8s-1-1-1-4 1-4 1-4" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" />
                    <path d="M17 8s1-1 1-4-1-4-1-4" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" />
                    <path d="M5 10s-2-2-2-6 2-6 2-6" stroke="rgba(255,255,255,0.4)" stroke-width="1" />
                    <path d="M19 10s2-2 2-6-2-6-2-6" stroke="rgba(255,255,255,0.4)" stroke-width="1" />
                </svg>
            </button>

            <div class="voice-overlay" id="voiceOverlay">
                <div class="status-indicator">
                    <div class="status-dot"></div>
                    <div class="status-text">Listening...</div>
                    <button class="close-btn" id="btnOverlayClose" onclick="toggleVoiceAssistant(event)" data-roberto-action="toggle-close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div class="sponken-response">
                    <p><span class="text" id="contentResponse"></span></p>
                </div>

                <div class="wave-center">
                    <div class="wave-circle"></div>
                    <div class="wave-circle"></div>
                    <div class="wave-circle"></div>
                    <div class="wave-circle"></div>
                    <div class="wave-circle"></div>
                </div>

                <div class="particles"></div>
            </div>
        </div>
    </div>


<?php
    return ob_get_clean();
}
