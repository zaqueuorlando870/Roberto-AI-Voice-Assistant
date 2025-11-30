// Voice Assistant for Search and Navigation

const inputElement = document.querySelector(
  "#bb-form-quick-search input[type=search]"
);
const buttonElement = document.querySelector("#bb-form-quick-search button");
const formElement = document.querySelector("#bb-form-quick-search");

// 🔹 Messages per language
const searchMessages = {
  en: (text) => `Searching for ${text}`,
  pt: (text) => `Procurando por ${text}`,
};

// 🔹 Shared function to handle search logic
function handleSearch(text) {
  if (!inputElement) {
    console.error("Search input not found");
    return;
  }

  // Fill search box
  inputElement.value = text;

  // Submit form if possible, otherwise click button
  if (formElement) {
    formElement.submit();
  } else if (buttonElement) {
    buttonElement.click();
  }

  // Speak feedback using current language
  const lang = reDMarketOn.lang || "en";
  if (searchMessages[lang]) {
    speak(searchMessages[lang](text));
  } else {
    speak(searchMessages["en"](text)); // fallback
  }
}

//Knowledge objects (trigger variations per language)
const localKnowledgePT = {
  "procurar por *text": handleSearch,
  "pesquisar por *text": handleSearch,
  "procurar *text": handleSearch,
  "pesquisar *text": handleSearch,
  "quero *text": handleSearch,
  "me mostra *text": handleSearch,
};

const localKnowledgeEN = {
  "search for *text": handleSearch,
  "find *text": handleSearch,
  "show me *text": handleSearch,
  "get me *text": handleSearch,
  "i want *text": handleSearch,
};

const localKnowledge = {
  pt: localKnowledgePT,
  en: localKnowledgeEN,
};

const reDMarketOn = {
  lang: window.location.pathname.split("/")[1],
};

let btn = null;
let overlay = null;
let btnOverlayClose = null;

let annyangCommandsAdded = false;
let annyangIsActive = false;

function toggleVoiceAssistant(event) {
  const btn = document.querySelector("#supportBtn");
  const overlay = document.querySelector("#voiceOverlay");
  const btnOverlayClose = document.querySelector("#btnOverlayClose");

  if (!btn) console.log("supportBtn NOT FOUND");
  if (!overlay) console.log("voiceOverlay NOT FOUND");

  if (!btn || !overlay) {
    console.log("Button or overlay missing!");
    return;
  }

  console.log("toggleVoiceAssistant function called");

  // Use a property on the overlay to track voice state
  if (typeof overlay.isVoiceActive === "undefined") {
    overlay.isVoiceActive = false; // initialize on first run
  }

  if (!overlay.isVoiceActive) {
    // Open overlay
    overlay.classList.add("active");
    btn.classList.add("active");
    overlay.isVoiceActive = true;
    console.log("Voice assistant activated");
    if (event) event.preventDefault();
    startVoiceRecognition();
  } else {
    // Close overlay
    overlay.classList.remove("active");
    btn.classList.remove("active");
    if (annyang) {
      annyang.abort();
      annyangIsActive = false;
      console.log("Voice recognition stopped via toggle");
    }
    overlay.isVoiceActive = false;
  }

  // Add close button listener (only once)
  if (btnOverlayClose && !btnOverlayClose.hasListener) {
    btnOverlayClose.addEventListener("click", () => {
      overlay.classList.remove("active");

      // Stop voice recognition
      if (annyang && overlay.isVoiceActive) {
        annyang.abort();
        annyangIsActive = false;
        console.log("Voice recognition stopped via close button");
      }

      overlay.isVoiceActive = false;
    });
    btnOverlayClose.hasListener = true; // prevent multiple listeners
  }
}

// Optional: Add keyboard shortcut (Space bar) to toggle voice assistant
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && event.target === document.body) {
    event.preventDefault();
    toggleVoiceAssistant();
  }
});

function getLanguageFromDomain() {
  // Check the locale and return the appropriate language code
  if (reDMarketOn.lang === "pt") {
    return "pt-PT";
  }
  return "en-ZA"; // Default language
}

const pageMap = {
  en: {
    products: "products",
    categories: "categories",
    stores: "stores",
    orders: "orders",
    brands: "brands",
    offers: "offers",
    profile: "profile",
    "most popular": "most-popular",
    favorites: "favorites",
    login: "login",
    register: "register",
    "shopping cart": "cart",
    "terms of use": "terms",
    "privacy policy": "policy",
    faq: "faq",
    "contact us": "contact-us",
    home: "/",
  },
  pt: {
    produtos: "products",
    categorias: "categories",
    lojas: "stores",
    pedidos: "orders",
    marcas: "brands",
    ofertas: "offers",
    perfil: "profile",
    "mais populares": "most-popular",
    favoritos: "favorites",
    entrar: "login",
    registrar: "register",
    "carrinho de compras": "cart",
    "termos de uso": "terms",
    "política de privacidade": "policy",
    "perguntas frequentes": "faq",
    "contate-nos": "contact-us",
    início: "/",
  },
};

function handleNavigation(page) {
  const lang = reDMarketOn.lang || "en";
  const urls = pageMap[lang] || pageMap["en"];
  const key = page.toLowerCase();

  if (!urls[key]) {
    const message =
      lang === "pt"
        ? `Página ${page} não encontrada`
        : `Page ${page} not found`;
    speak(message);
    console.warn(`Unknown page: ${page}`);
    return;
  }

  const currentUrl = new URL(window.location.href);
  const targetPath = `/${urls[key]}`;

  let newUrl;

  // Preserve query string only if staying on the same base path
  if (currentUrl.pathname === targetPath && currentUrl.search) {
    newUrl = targetPath + currentUrl.search;
  } else {
    newUrl = targetPath;
  }

  window.location.href = newUrl;

  const message =
    lang === "pt" ? `Navegando para ${page}` : `Navigating to ${page}`;
  speak(message);
}

function similarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;

  const editDistance = (a, b) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1))
          matrix[i][j] = matrix[i - 1][j - 1];
        else
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          );
      }
    }
    return matrix[b.length][a.length];
  };

  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

function splitCommands(input, lang) {
  const separators = lang === "pt" ? [" e ", " e então "] : [" and ", " then "];
  let commands = [input];
  separators.forEach((sep) => {
    commands = commands.flatMap((cmd) => cmd.split(sep));
  });
  return commands.map((c) => c.trim()).filter(Boolean);
}

function getLocalAnswer(transcript) {
  const cleanedTranscript = transcript.replace(/\s+/g, " ").trim();
  const lang = reDMarketOn.lang || "en";
  const lowerQ = cleanedTranscript.toLowerCase();
  const knowledge = localKnowledge[lang] || localKnowledge["en"];

  // Split input for multiple commands
  const commandsList = splitCommands(cleanedTranscript, lang);

  for (const userCmd of commandsList) {
    const lowerCmd = userCmd.toLowerCase();

    // Handle search commands
    for (const pattern in knowledge) {
      if (pattern.includes("*text")) {
        const prefix = pattern.replace("*text", "").trim().toLowerCase();
        if (lowerCmd.startsWith(prefix)) {
          const extractedText = userCmd.slice(prefix.length).trim();
          return knowledge[pattern](extractedText);
        } else if (similarity(lowerCmd, prefix) > 0.8) {
          const extractedText = userCmd.slice(prefix.length).trim();
          return knowledge[pattern](extractedText);
        }
      }
    }

    // Handle navigation commands
    const navTriggers =
      lang === "pt"
        ? [
            "ir para",
            "vá para",
            "abrir",
            "mostre",
            "mostre me",
            "leve me para",
            "me leve para",
            "vá até",
            "dirija-se a",
            "ir até",
            "entrar em",
            "acessar",
            "acessar página",
            "abrir página",
            "ir até a página",
            "vá até a página",
          ]
        : [
            "go to",
            "navigate to",
            "open",
            "show",
            "show me",
            "take me to",
            "bring me to",
            "go towards",
            "enter",
            "access",
            "access page",
            "open page",
            "go to the page",
            "navigate to the page",
          ];
    for (const nav of navTriggers) {
      if (lowerCmd.startsWith(nav)) {
        const page = userCmd.slice(nav.length).trim();
        return handleNavigation(page);
      }
    }
  }

  return null;
}

function cleanText(text) {
  // console.info("Before cleanText:", text);
  if (typeof text !== "string") {
    // console.warn("cleanText received non-string:", text);
    return "";
  }

  // Remove markdown bold/italic, keep emojis and punctuation
  return text
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD800-\uDFFF]|[\uFE00-\uFE0F]|\u24C2|\uD83C[\uDDE6-\uDDFF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEFF])/g,
      ""
    )
    .replace(/\*\*/g, "") // remove bold **
    .replace(/\*+/g, "") // remove remaining *
    .replace(/\n+/g, ". ") // replace line breaks with periods
    .replace(/\s+/g, " ") // normalize whitespace
    .trim();
}

function extractTextFromFunction(fn) {
  if (typeof fn === "function") {
    const fnStr = fn.toString();
    // Match the text inside single or double quotes
    const match = fnStr.match(/['"`](.*?)['"`]/);
    if (match && match[1]) return match[1];
  }
  return fn; // if it's already a string
}

function formatResponseText(text) {
  // Handle markdown-style links [Label](Link)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, link) {
    // Remove trailing dot if exists
    link = link.replace(/\.$/, "");

    // If link is the same as label, just return label
    if (label.trim() === link.trim()) {
      return `${label}`;
    }
    return `${label} -> ${link}`;
  });

  // Handle plain URLs and transform them into styled links
  text = text.replace(/(https?:\/\/[^\s]+)/g, function (url) {
    // Remove trailing dot if exists
    url = url.replace(/\.$/, "");

    try {
      let urlObj = new URL(url);
      let parts = urlObj.pathname.split("/");

      // pega o último pedaço do path (slug do produto)
      let slug = parts.pop() || parts.pop();
      // transforma slug em título legível
      let name = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return `<a href="${url}" style="color:#e60000; text-decoration:none; font-weight:500;">${name}</a>`;
    } catch (e) {
      return url; // fallback se não for URL válida
    }
  });

  return text;
}

function displayResponse(text) {
  const contentResponse = document.getElementById("contentResponse");
  contentResponse.innerHTML = `
            <div style="font-family: Arial, sans-serif; line-height:1.6; padding:10px 15px; background:#f9f9f9; margin-top:10px; border-radius:8px; border:1px solid #ddd; color:#081729;">
              ${formatResponseText(text)}
            </div>
          `;

  document.querySelector(".status-text").textContent = "Speaking...";
}

function cleanSpeakingText(input) {
  if (!input) return "";

  // Remove HTML tags, URLs, special characters (keep letters, numbers, spaces, punctuation for readability)
  let text = input
    .replace(/<[^>]*>/g, "") // remove HTML tags
    .replace(/https?:\/\/\S+/g, "") // remove URLs
    .replace(/[^\w\s.,!?]/g, "") // remove unwanted special characters, keep basic punctuation
    .replace(/\n+/g, ". ") // replace line breaks with periods
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim();

  // Capitalize the first letter of each sentence
  text = text.replace(/(^\w)|(\.\s+\w)/g, (c) => c.toUpperCase());

  return text;
}

function startVoiceRecognition() {
  const lang = reDMarketOn.lang;
  if (!annyang || annyangIsActive) return; // prevent multiple starts

  annyangIsActive = true;
  annyang.setLanguage(lang === "pt" ? "pt-PT" : "en-US");

  // Add commands only once
  if (!annyangCommandsAdded) {
    const commands = {
      "*userInput": async (userInput) => {
        // Stop recognition to prevent repeated requests
        annyang.abort();
        annyangIsActive = false;

        let input = userInput.toLowerCase();
        console.log("Input Result: " + input);

        const result = getLocalAnswer(input);

        if (result !== null) {
          console.log("Local Knowledge executed:", result);
        } else {
          const responseAnswer = await getChatGPTAnswer(lang, userInput);
          const textOnly = cleanSpeakingText(responseAnswer);
          speak(textOnly);
          displayResponse(responseAnswer);
        }
      },
    };

    annyang.addCommands(commands);
    annyangCommandsAdded = true;
  }

  annyang.start({ autoRestart: false, continuous: true }); // prevent automatic repeats
}

async function getChatGPTAnswer(lang, userInput) {
  const res = await fetch(
    `${window.location.origin}/wp-json/roberto-ai/v1/get-answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": robertoAiData.nonce, // <--- must match header in PHP
      },
      credentials: "same-origin",
      body: JSON.stringify({ lang, userInput }),
    }
  );

  const data = await res.json();

  const messageResponse = data.output?.[0]?.content?.find(
    (c) => c.type === "output_text"
  )?.text;
  return messageResponse;
}

async function speak(message) {
  if (!("speechSynthesis" in window)) {
    console.error("Speech synthesis not supported in this browser.");
    return;
  }

  // Wait for voices to be available
  function getVoices() {
    return new Promise((resolve) => {
      let voices = speechSynthesis.getVoices();
      if (voices.length) {
        resolve(voices);
      } else {
        speechSynthesis.onvoiceschanged = () => {
          voices = speechSynthesis.getVoices();
          resolve(voices);
        };
      }
    });
  }

  const voices = await getVoices();
  const lang = getLanguageFromDomain(); // e.g., 'pt-PT'

  // Build the utterance
  const speech = new SpeechSynthesisUtterance(message);
  speech.lang = lang;

  // More natural settings
  speech.volume = 1;
  speech.rate = 0.80;  // slightly slower = more human
  speech.pitch = 1.99; // softer tone

  // Better human-sounding voice search
  const preferredNames = [
    "samantha",
    "victoria",
    "zira",
    "google",
    "natural",
    "neural",
    "camila",
    "joanna",
    "isabela"
  ];

  let voice =
    voices.find(
      (v) =>
        v.lang.startsWith(lang) &&
        preferredNames.some((n) => v.name.toLowerCase().includes(n))
    ) ||
    voices.find((v) => v.lang.startsWith(lang)) ||
    voices[0];

  speech.voice = voice;

  // Stop any current speech before speaking
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }

  // Restart voice recognition AFTER the speaking ends
  speech.onend = () => {
    console.log("Speech finished. Restarting voice recognition...");

    // Make sure recognition is allowed to start again
    annyangIsActive = false;

    // Restart after small delay to prevent overlap
    setTimeout(() => {
      startVoiceRecognition();
    }, 150);
  };

  // Slight delay so voices load correctly
  setTimeout(() => {
    speechSynthesis.speak(speech);
  }, 120);
}