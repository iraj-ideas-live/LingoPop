const STORAGE_KEY = "lingopop_state_v1";

const defaultState = {
  words: [],
  settings: {
    apiKey: "",
    model: "gemini-flash-latest",
    driveClientId: "",
    driveFileName: "lingopop-cards.json",
    driveFileId: "",
    theme: "clean",
    cardTheme: "inherit",
    cardCustom: {
      titleColor: "#2f2f37",
      textColor: "#3f3f4a",
      bgColor: "#ffffff",
    },
    stickyPracticeButtons: true,
    language: "fa",
    shelves: [
      { id: "default", name: "Default", description: "", isDefault: true },
    ],
    activeShelfId: "default",
  },
};

const state = loadState();
let practiceState = {
  deck: [],
  currentIndex: 0,
  showAnswer: false,
  activeBox: null,
  currentBoxIndex: 0,
};

const I18N = {
  fa: {
    subtitle: "مدیریت لغت و تمرین با جعبه‌های G5",
    tab_words: "لغت‌ها",
    tab_practice: "تمرین",
    tab_settings: "تنظیمات",
    add_word_title: "افزودن لغت",
    add_word_placeholder: "هر خط یک لغت",
    add_word_btn: "افزودن",
    vocabulary_title: "لغت‌ها",
    sync_label: "دریافت معنی",
    practice_empty: "هنوز هیچ لغتی اضافه نشده است.",
    g5_all: "همه",
    practice_show: "مشاهده",
    practice_back: "برگشت",
    practice_known: "بلدم",
    practice_unknown: "نمی‌دونم",
    practice_done: "تمرین این باکس تمام شد.",
    correction_title: "املای درست:",
    correction_action: "جایگزین کن",
    correction_copy: "کپی",
    correction_added: "لغت درست اضافه شد و غلط حذف شد.",
    google_api_settings: "تنظیمات Google API",
    api_key_label: "کلید API",
    api_key_placeholder: "Google API Key",
    model_label: "مدل",
    language_label: "زبان",
    google_api_hint:
      "این برنامه از Google Generative Language API استفاده می‌کند تا برای هر لغت معنی فارسی، معنی انگلیسی، جمله نمونه و هم‌معنی‌ها را تولید کند.",
    save_settings: "ذخیره تنظیمات",
    drive_sync_title: "سینک با Google Drive",
    drive_client_id: "Client ID",
    drive_client_placeholder: "Google OAuth Client ID",
    drive_client_help:
      "راهنمای دریافت Client ID: 1) وارد Google Cloud Console شوید. 2) یک پروژه بسازید یا انتخاب کنید. 3) به APIs & Services > OAuth consent screen بروید و آن را تنظیم کنید. 4) به APIs & Services > Credentials بروید و Create Credentials > OAuth client ID را بزنید. 5) Application type را روی Web قرار دهید. 6) در Authorized JavaScript origins آدرس این برنامه را بگذارید (مثلا http://localhost). 7) Client ID ساخته شده را اینجا وارد کنید.",
    drive_file_name: "نام فایل در Drive",
    drive_file_id: "File ID (اختیاری)",
    drive_file_id_placeholder: "اگر فایل را دارید وارد کنید",
    drive_login: "ورود با گوگل",
    drive_sync: "سینک با Drive",
    json_section: "ورود و خروجی JSON",
    json_import: "ورود فایل",
    json_import_hint: "فرمت ورود: آرایه‌ای از رشته‌ها یا اشیاء با کلید word",
    json_export: "خروجی کامل کارت‌ها",
    cards_import: "ورود کارت‌های کامل",
    cards_import_hint:
      "فرمت: آرایه‌ای از کارت‌ها با فیلد word. کارت‌های تکراری اضافه نمی‌شوند.",
    theme_title: "نمای ظاهری",
    card_theme_title: "تم کارت‌های لغت",
    card_preview_hint: "پیش‌نمایش کارت لغت",
    practice_settings_title: "تنظیمات تمرین",
    sticky_buttons_label: "چسباندن دکمه‌های تمرین در پایین صفحه",
    about_title: "درباره نرم‌افزار",
    about_text:
      "LingoPop یک برنامه ساده و سبک برای مدیریت لغت، ساخت کارت‌های آموزشی و تمرین با جعبه‌های G5 است. شما می‌توانید لغت‌ها را دستی یا از طریق فایل JSON وارد کنید، با Google API برای هر لغت معنی فارسی، معنی انگلیسی، تلفظ، جمله نمونه و هم‌معنی‌ها تولید کنید و سپس در تب تمرین آن‌ها را مرور کنید. همه داده‌ها به‌صورت محلی ذخیره می‌شوند و در صورت نیاز می‌توانید کارت‌ها را با فایل موجود در Google Drive نیز سینک کنید.",
    meaning_target: "معنی:",
    meaning_english: "معنی انگلیسی:",
    pronunciation: "تلفظ:",
    example: "جمله:",
    synonyms: "هم‌معنی‌ها:",
    play_pronunciation: "پخش تلفظ",
    speech_not_supported: "مرورگر شما از تلفظ پشتیبانی نمی‌کند.",
    sample_meaning_fa: "نمونه",
    sample_meaning_en: "sample",
    sample_pronunciation: "/ˈsæm.pəl/",
    sample_sentence: "This is a sample sentence.",
    sample_synonyms: "example, instance",
    words_added: "{count} لغت اضافه شد.",
    custom_shelf_missing: "لطفا همه فیلدهای شلف اختصاصی را پر کنید.",
    custom_shelf_empty: "برای این شلف لغتی تولید نشد.",
    custom_shelf_done: "شلف اختصاصی ساخته شد. {count} لغت اضافه شد.",
    custom_shelf_no_new: "لغت جدیدی برای اضافه‌کردن پیدا نشد.",
    json_select_file: "لطفا یک فایل JSON انتخاب کنید.",
    json_imported: "{count} لغت از فایل وارد شد.",
    json_invalid: "فرمت فایل JSON معتبر نیست.",
    cards_select_file: "لطفا یک فایل JSON کارت‌ها انتخاب کنید.",
    cards_imported: "{added} کارت جدید اضافه شد. {skipped} تکراری بود.",
    cards_invalid: "فرمت فایل کارت‌ها معتبر نیست.",
    settings_saved: "تنظیمات ذخیره شد.",
    api_key_required: "لطفا کلید API را در تنظیمات وارد کنید.",
    sync_all_none: "همه لغت‌ها کامل هستند.",
    sync_in_progress: "در حال سینک {count} لغت در یک درخواست...",
    sync_done: "سینک تمام شد.",
    sync_partial: "سینک انجام شد. {missing} لغت بدون پاسخ ماند.",
    sync_error: "خطا در سینک با Google API",
    confirm_delete: "آیا مطمئن هستی که این لغت حذف شود؟",
    confirm_remove_shelf:
      "آیا مطمئن هستی که این شلف حذف شود؟ {count} لغت در این شلف است. بعد از حذف، لغت‌ها به شلف پیش‌فرض منتقل می‌شوند و پاک نمی‌شوند.",
    box_empty: "هیچ لغتی در این باکس نیست",
    word_counts_all: "تعداد لغت‌ها: {total}",
    word_counts_box: "تعداد لغت‌ها (باکس {box}): {count}",
    practice_progress: "کارت {current} از {total}",
    drive_need_client: "ابتدا Client ID را وارد کنید.",
    drive_lib_not_loaded: "کتابخانه ورود گوگل هنوز بارگذاری نشده است.",
    drive_login_ok: "ورود با گوگل انجام شد.",
    drive_login_fail: "ورود با گوگل ناموفق بود.",
    drive_need_login: "ابتدا وارد حساب گوگل شوید.",
    drive_syncing: "در حال سینک با Drive...",
    drive_sync_done: "سینک با Drive انجام شد.",
    drive_sync_error: "خطا در سینک با Drive",
    no_response_word: "پاسخی برای این لغت دریافت نشد.",
    card_completed: "کارت تکمیل شد.",
  },
  en: {
    subtitle: "Vocabulary management and G5 practice",
    tab_words: "Words",
    tab_practice: "Practice",
    tab_settings: "Settings",
    add_word_title: "Add words",
    add_word_placeholder: "One word per line",
    add_word_btn: "Add",
    vocabulary_title: "Vocabulary",
    sync_label: "Fetch meanings",
    practice_empty: "No words added yet.",
    g5_all: "All",
    practice_show: "Show",
    practice_back: "Back",
    practice_known: "Know it",
    practice_unknown: "Don't know",
    practice_done: "Practice in this box is complete.",
    correction_title: "Did you mean:",
    correction_action: "Replace",
    correction_copy: "Copy",
    correction_added: "Correct word added and misspelled removed.",
    google_api_settings: "Google API Settings",
    api_key_label: "API Key",
    api_key_placeholder: "Google API Key",
    model_label: "Model",
    language_label: "Language",
    google_api_hint:
      "This app uses Google Generative Language API to generate meanings, example sentences, and synonyms.",
    save_settings: "Save settings",
    drive_sync_title: "Google Drive Sync",
    drive_client_id: "Client ID",
    drive_client_placeholder: "Google OAuth Client ID",
    drive_client_help:
      "Client ID guide: 1) Open Google Cloud Console. 2) Create or select a project. 3) Go to APIs & Services > OAuth consent screen. 4) Go to APIs & Services > Credentials and create OAuth client ID. 5) Choose Web. 6) Add Authorized JavaScript origins (e.g., http://localhost). 7) Paste the Client ID here.",
    drive_file_name: "Drive file name",
    drive_file_id: "File ID (optional)",
    drive_file_id_placeholder: "Paste file id if you have it",
    drive_login: "Sign in with Google",
    drive_sync: "Sync Drive",
    json_section: "JSON Import/Export",
    json_import: "Import file",
    json_import_hint: "Format: array of strings or objects with word key",
    json_export: "Export all cards",
    cards_import: "Import full cards",
    cards_import_hint: "Format: array of cards with word field. Duplicates are skipped.",
    theme_title: "Appearance",
    card_theme_title: "Word card theme",
    card_preview_hint: "Word card preview",
    practice_settings_title: "Practice Settings",
    sticky_buttons_label: "Stick practice buttons to bottom",
    about_title: "About",
    about_text:
      "LingoPop is a lightweight app for vocabulary cards and G5 practice. Add words manually or via JSON, generate meanings, pronunciation, example sentences, and synonyms via Google API, then practice in the Practice tab. Data is stored locally and can sync with Google Drive.",
    meaning_target: "Meaning:",
    meaning_english: "English meaning:",
    pronunciation: "Pronunciation:",
    example: "Example:",
    synonyms: "Synonyms:",
    play_pronunciation: "Play pronunciation",
    speech_not_supported: "Your browser does not support speech synthesis.",
    sample_meaning_fa: "sample",
    sample_meaning_en: "sample",
    sample_pronunciation: "/ˈsæm.pəl/",
    sample_sentence: "This is a sample sentence.",
    sample_synonyms: "example, instance",
    words_added: "{count} words added.",
    custom_shelf_missing: "Please fill all custom shelf fields.",
    custom_shelf_empty: "No words were generated for this shelf.",
    custom_shelf_done: "Custom shelf created. {count} words added.",
    custom_shelf_no_new: "No new words were added.",
    json_select_file: "Please select a JSON file.",
    json_imported: "{count} words imported.",
    json_invalid: "Invalid JSON format.",
    cards_select_file: "Please select a cards JSON file.",
    cards_imported: "{added} new cards added. {skipped} duplicates.",
    cards_invalid: "Invalid cards JSON format.",
    settings_saved: "Settings saved.",
    api_key_required: "Please enter API key in settings.",
    sync_all_none: "All words are complete.",
    sync_in_progress: "Syncing {count} words in one request...",
    sync_done: "Sync complete.",
    sync_partial: "Sync done. {missing} words missing.",
    sync_error: "Google API sync failed.",
    confirm_delete: "Are you sure you want to delete this word?",
    confirm_remove_shelf:
      "Are you sure you want to delete this shelf? It contains {count} words. After deletion, words move to the default shelf and are not deleted.",
    box_empty: "No words in this box",
    word_counts_all: "Word count: {total}",
    word_counts_box: "Word count (box {box}): {count}",
    practice_progress: "Card {current} of {total}",
    drive_need_client: "Please enter Client ID first.",
    drive_lib_not_loaded: "Google sign-in library is not loaded yet.",
    drive_login_ok: "Signed in successfully.",
    drive_login_fail: "Google sign-in failed.",
    drive_need_login: "Please sign in first.",
    drive_syncing: "Syncing with Drive...",
    drive_sync_done: "Drive sync complete.",
    drive_sync_error: "Drive sync failed.",
    no_response_word: "No response for this word.",
    card_completed: "Card completed.",
  },
  nl: {
    subtitle: "Woordenbeheer en oefenen met G5-boxen",
    tab_words: "Woorden",
    tab_practice: "Oefenen",
    tab_settings: "Instellingen",
    add_word_title: "Woorden toevoegen",
    add_word_placeholder: "Eén woord per regel",
    add_word_btn: "Toevoegen",
    vocabulary_title: "Woorden",
    sync_label: "Betekenis ophalen",
    practice_empty: "Er zijn nog geen woorden.",
    g5_all: "Alle",
    practice_show: "Bekijk",
    practice_back: "Terug",
    practice_known: "Ken ik",
    practice_unknown: "Weet ik niet",
    practice_done: "Oefenen in deze box is klaar.",
    correction_title: "Bedoelde je:",
    correction_action: "Vervangen",
    correction_copy: "Kopiëren",
    correction_added: "Correct woord toegevoegd en fout verwijderd.",
    google_api_settings: "Google API-instellingen",
    api_key_label: "API-sleutel",
    api_key_placeholder: "Google API Key",
    model_label: "Model",
    language_label: "Taal",
    google_api_hint:
      "Deze app gebruikt de Google Generative Language API om betekenissen, voorbeeldzinnen en synoniemen te maken.",
    save_settings: "Instellingen opslaan",
    drive_sync_title: "Google Drive synchronisatie",
    drive_client_id: "Client ID",
    drive_client_placeholder: "Google OAuth Client ID",
    drive_client_help:
      "Client ID handleiding: 1) Open Google Cloud Console. 2) Maak/Selecteer een project. 3) Ga naar APIs & Services > OAuth consent screen. 4) Ga naar APIs & Services > Credentials en maak OAuth client ID. 5) Kies Web. 6) Voeg Authorized JavaScript origins toe (bijv. http://localhost). 7) Plak de Client ID hier.",
    drive_file_name: "Bestandsnaam in Drive",
    drive_file_id: "File ID (optioneel)",
    drive_file_id_placeholder: "Plak file id als je die hebt",
    drive_login: "Inloggen met Google",
    drive_sync: "Drive synchroniseren",
    json_section: "JSON import/export",
    json_import: "Bestand importeren",
    json_import_hint: "Formaat: array van strings of objecten met word key",
    json_export: "Alle kaarten exporteren",
    cards_import: "Volledige kaarten importeren",
    cards_import_hint: "Formaat: array kaarten met word veld. Dubbelen worden overgeslagen.",
    theme_title: "Uiterlijk",
    card_theme_title: "Kaartthema",
    card_preview_hint: "Voorbeeld kaart",
    practice_settings_title: "Oefeninstellingen",
    sticky_buttons_label: "Oefenknoppen onderaan vastzetten",
    about_title: "Over",
    about_text:
      "LingoPop is een lichte app voor woordkaarten en G5-oefenen. Voeg woorden handmatig of via JSON toe, genereer betekenissen, uitspraak, voorbeeldzinnen en synoniemen via Google API, en oefen in het Oefenen-tabblad. Gegevens worden lokaal opgeslagen en kunnen met Google Drive worden gesynchroniseerd.",
    meaning_target: "Betekenis:",
    meaning_english: "Engelse betekenis:",
    pronunciation: "Uitspraak:",
    example: "Voorbeeld:",
    synonyms: "Synoniemen:",
    play_pronunciation: "Uitspraak afspelen",
    speech_not_supported: "Je browser ondersteunt geen spraaksynthese.",
    sample_meaning_fa: "voorbeeld",
    sample_meaning_en: "sample",
    sample_pronunciation: "/ˈsæm.pəl/",
    sample_sentence: "This is a sample sentence.",
    sample_synonyms: "example, instance",
    words_added: "{count} woorden toegevoegd.",
    custom_shelf_missing: "Vul alle velden van de custom shelf in.",
    custom_shelf_empty: "Er zijn geen woorden gegenereerd voor deze shelf.",
    custom_shelf_done: "Custom shelf gemaakt. {count} woorden toegevoegd.",
    custom_shelf_no_new: "Er zijn geen nieuwe woorden toegevoegd.",
    json_select_file: "Selecteer een JSON-bestand.",
    json_imported: "{count} woorden geïmporteerd.",
    json_invalid: "Ongeldig JSON-formaat.",
    cards_select_file: "Selecteer een kaarten-JSON bestand.",
    cards_imported: "{added} nieuwe kaarten toegevoegd. {skipped} dubbelen.",
    cards_invalid: "Ongeldig kaarten-JSON formaat.",
    settings_saved: "Instellingen opgeslagen.",
    api_key_required: "Vul de API-sleutel in bij instellingen.",
    sync_all_none: "Alle woorden zijn compleet.",
    sync_in_progress: "Bezig met {count} woorden in één verzoek...",
    sync_done: "Synchronisatie voltooid.",
    sync_partial: "Sync klaar. {missing} woorden ontbreken.",
    sync_error: "Google API synchronisatie mislukt.",
    confirm_delete: "Weet je zeker dat je dit woord wilt verwijderen?",
    confirm_remove_shelf:
      "Weet je zeker dat je deze shelf wilt verwijderen? Deze bevat {count} woorden. Na verwijderen gaan woorden naar de default shelf en worden niet verwijderd.",
    box_empty: "Geen woorden in deze box",
    word_counts_all: "Aantal woorden: {total}",
    word_counts_box: "Aantal woorden (box {box}): {count}",
    practice_progress: "Kaart {current} van {total}",
    drive_need_client: "Vul eerst Client ID in.",
    drive_lib_not_loaded: "Google sign-in bibliotheek is nog niet geladen.",
    drive_login_ok: "Inloggen gelukt.",
    drive_login_fail: "Inloggen mislukt.",
    drive_need_login: "Log eerst in.",
    drive_syncing: "Bezig met Drive-synchronisatie...",
    drive_sync_done: "Drive-synchronisatie voltooid.",
    drive_sync_error: "Drive-synchronisatie mislukt.",
    no_response_word: "Geen antwoord voor dit woord.",
    card_completed: "Kaart voltooid.",
  },
};

function t(key, vars = {}) {
  const lang = state.settings.language || "fa";
  const template = I18N[lang]?.[key] || I18N.fa[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
}

const elements = {
  tabs: document.querySelectorAll(".tab-button"),
  panels: document.querySelectorAll(".tab-panel"),
  wordInput: document.getElementById("wordInput"),
  addWords: document.getElementById("addWords"),
  jsonFile: document.getElementById("jsonFile"),
  importJson: document.getElementById("importJson"),
  exportJson: document.getElementById("exportJson"),
  syncWords: document.getElementById("syncWords"),
  syncStatus: document.getElementById("syncStatus"),
  wordList: document.getElementById("wordList"),
  cardsJsonFile: document.getElementById("cardsJsonFile"),
  importCards: document.getElementById("importCards"),
  practiceEmpty: document.getElementById("practiceEmpty"),
  practiceCard: document.getElementById("practiceCard"),
  g5Boxes: document.getElementById("g5Boxes"),
  g5BoxesReset: document.querySelector(".g5-box.reset"),
  g5Counts: document.getElementById("g5Counts"),
  practiceFlip: document.getElementById("practiceFlip"),
  practiceFrontCard: document.getElementById("practiceFrontCard"),
  practiceWord: document.getElementById("practiceWord"),
  practiceDetails: document.getElementById("practiceDetails"),
  practiceProgressFill: document.getElementById("practiceProgressFill"),
  markKnown: document.getElementById("markKnown"),
  markUnknown: document.getElementById("markUnknown"),
  practiceActions: document.querySelector("#practiceCard .practice-actions"),
  practiceProgress: document.getElementById("practiceProgress"),
  apiKey: document.getElementById("apiKey"),
  modelName: document.getElementById("modelName"),
  languageSelect: document.getElementById("languageSelect"),
  saveSettings: document.getElementById("saveSettings"),
  driveClientId: document.getElementById("driveClientId"),
  driveFileName: document.getElementById("driveFileName"),
  driveFileId: document.getElementById("driveFileId"),
  driveLogin: document.getElementById("driveLogin"),
  driveSync: document.getElementById("driveSync"),
  driveStatus: document.getElementById("driveStatus"),
  themeChips: document.getElementById("themeChips"),
  cardThemeChips: document.getElementById("cardThemeChips"),
  cardThemePreview: document.getElementById("cardThemePreview"),
  cardThemeControls: document.getElementById("cardThemeControls"),
  cardTitleColor: document.getElementById("cardTitleColor"),
  cardTextColor: document.getElementById("cardTextColor"),
  cardBgColor: document.getElementById("cardBgColor"),
  stickyPracticeButtons: document.getElementById("stickyPracticeButtons"),
  settingsMenu: document.getElementById("settingsMenu"),
  settingsBack: document.getElementById("settingsBack"),
  settingsPages: document.querySelectorAll(".settings-page"),
  settingsItems: document.querySelectorAll(".settings-item"),
  shelfSelect: document.getElementById("shelfSelect"),
  shelfName: document.getElementById("shelfName"),
  addShelf: document.getElementById("addShelf"),
  shelfList: document.getElementById("shelfList"),
  customShelfName: document.getElementById("customShelfName"),
  customShelfDescription: document.getElementById("customShelfDescription"),
  customShelfLevel: document.getElementById("customShelfLevel"),
  customShelfLanguage: document.getElementById("customShelfLanguage"),
  customShelfCount: document.getElementById("customShelfCount"),
  createCustomShelf: document.getElementById("createCustomShelf"),
  customShelfStatus: document.getElementById("customShelfStatus"),
};

let driveAuth = {
  tokenClient: null,
  accessToken: "",
  expiresAt: 0,
};

init();

function init() {
  elements.apiKey.value = state.settings.apiKey;
  elements.modelName.value = state.settings.model;
  if (elements.languageSelect) {
    elements.languageSelect.value = state.settings.language || "fa";
  }
  if (elements.customShelfLanguage) {
    elements.customShelfLanguage.value = state.settings.language || "fa";
  }
  ensureShelves();
  elements.driveClientId.value = state.settings.driveClientId;
  elements.driveFileName.value = state.settings.driveFileName || "lingopop-cards.json";
  elements.driveFileId.value = state.settings.driveFileId || "";
  applyLanguage();
  applyTheme(state.settings.theme);
  applyCardTheme(state.settings.cardTheme);
  applyCardCustomInputs();
  applyStickyPracticeButtons();
  renderShelfSelect();
  renderShelfList();
  wireEvents();
  renderWords();
  refreshPracticeDeck();
  renderPractice();
}

function wireEvents() {
  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveTab(tab.dataset.tab);
    });
  });

  elements.settingsItems.forEach((item) => {
    item.addEventListener("click", () => {
      const page = item.dataset.settingsTarget;
      showSettingsPage(page);
    });
  });

  if (elements.settingsBack) {
    elements.settingsBack.addEventListener("click", () => {
      showSettingsPage(null);
    });
  }

  elements.addWords.addEventListener("click", async () => {
    const lines = elements.wordInput.value.split("\n");
    const added = await addWordsWithCorrection(lines);
    elements.wordInput.value = "";
    setStatus(t("words_added", { count: added }));
  });

  elements.importJson.addEventListener("click", () => {
    if (!elements.jsonFile.files?.length) {
      setStatus(t("json_select_file"));
      return;
    }
    const file = elements.jsonFile.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result);
        const words = extractWordsFromJson(data);
        const added = await addWordsWithCorrection(words);
        setStatus(t("json_imported", { count: added }));
      } catch (error) {
        setStatus(t("json_invalid"));
      }
    };
    reader.readAsText(file);
  });

  elements.importCards.addEventListener("click", () => {
    if (!elements.cardsJsonFile.files?.length) {
      setStatus(t("cards_select_file"));
      return;
    }
    const file = elements.cardsJsonFile.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const { added, skipped } = addCardsFromJson(data);
        setStatus(t("cards_imported", { added, skipped }));
      } catch (error) {
        setStatus(t("cards_invalid"));
      }
    };
    reader.readAsText(file);
  });

  elements.exportJson.addEventListener("click", () => {
    const payload = JSON.stringify(state.words, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "lingopop-words.json";
    anchor.click();
    URL.revokeObjectURL(url);
  });

  elements.syncWords.addEventListener("click", async () => {
    await syncAllWords();
  });

  elements.practiceFlip.addEventListener("click", () => {
    practiceState.showAnswer = !practiceState.showAnswer;
    renderPractice();
  });

  let swipeStart = null;
  elements.practiceFlip.addEventListener("pointerdown", (event) => {
    swipeStart = { x: event.clientX, y: event.clientY };
  });
  elements.practiceFlip.addEventListener("pointerup", (event) => {
    if (!swipeStart) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) {
      goToNextCard();
    } else {
      goToPrevCard();
    }
  });

  elements.markKnown.addEventListener("click", () => {
    updatePracticeResult(true);
  });

  elements.markUnknown.addEventListener("click", () => {
    updatePracticeResult(false);
  });

  elements.g5Boxes.addEventListener("click", (event) => {
    const target = event.target.closest(".g5-box");
    if (!target) return;
    const boxValue = Number(target.dataset.box || "0");
    if (!boxValue) return;
    practiceState.activeBox =
      practiceState.activeBox === boxValue ? null : boxValue;
    refreshPracticeDeck();
    renderPractice();
  });
  elements.g5BoxesReset.addEventListener("click", () => {
    practiceState.activeBox = null;
    practiceState.currentBoxIndex = 0;
    refreshPracticeDeck();
    renderPractice();
  });

  elements.saveSettings.addEventListener("click", () => {
    state.settings.apiKey = elements.apiKey.value.trim();
    state.settings.model = elements.modelName.value.trim() || "gemini-flash-latest";
    state.settings.driveClientId = elements.driveClientId.value.trim();
    state.settings.driveFileName =
      elements.driveFileName.value.trim() || "lingopop-cards.json";
    state.settings.driveFileId = elements.driveFileId.value.trim();
    if (elements.languageSelect) {
      state.settings.language = elements.languageSelect.value;
    }
    saveState();
    applyLanguage();
    setStatus(t("settings_saved"));
  });

  if (elements.languageSelect) {
    elements.languageSelect.addEventListener("change", (event) => {
      state.settings.language = event.target.value;
      saveState();
      applyLanguage();
      renderWords();
      renderPractice();
    });
  }

  if (elements.shelfSelect) {
    elements.shelfSelect.addEventListener("change", (event) => {
      state.settings.activeShelfId = event.target.value;
      saveState();
      renderWords();
    });
  }

  elements.addShelf.addEventListener("click", () => {
    const name = elements.shelfName.value.trim();
    if (!name) return;
    createShelf({ name });
    elements.shelfName.value = "";
    renderShelfSelect();
    renderShelfList();
    renderWords();
  });

  elements.createCustomShelf.addEventListener("click", async () => {
    const name = elements.customShelfName.value.trim();
    const description = elements.customShelfDescription.value.trim();
    const level = elements.customShelfLevel.value;
    const language = elements.customShelfLanguage.value || state.settings.language;
    const count = Number(elements.customShelfCount.value || 0);
    if (!name || !description || !count) {
      setCustomShelfStatus(t("custom_shelf_missing"));
      return;
    }
    if (!state.settings.apiKey) {
      setCustomShelfStatus(t("api_key_required"));
      return;
    }
    const shelf = createShelf({ name, description });
    try {
      const words = await generateShelfWords(description, level, count, language);
      if (!words.length) {
        setCustomShelfStatus(t("custom_shelf_empty"));
        return;
      }
      const added = await addWordsWithCorrection(words, shelf.id);
      setStatus(t("words_added", { count: added }));
      setCustomShelfStatus(
        added > 0 ? t("custom_shelf_done", { count: added }) : t("custom_shelf_no_new")
      );
      renderShelfSelect();
      renderShelfList();
      renderWords();
    } catch (error) {
      console.error(error);
      setCustomShelfStatus(error.message || t("sync_error"));
    }
  });

  elements.themeChips.addEventListener("click", (event) => {
    const target = event.target.closest(".theme-chip");
    if (!target) return;
    setTheme(target.dataset.theme);
  });

  elements.cardThemeChips.addEventListener("click", (event) => {
    const target = event.target.closest(".theme-chip");
    if (!target) return;
    setCardTheme(target.dataset.cardTheme);
  });

  const cardColorInputs = [
    elements.cardTitleColor,
    elements.cardTextColor,
    elements.cardBgColor,
  ];
  cardColorInputs.forEach((input) => {
    input.addEventListener("input", () => {
      updateCardCustomColors();
    });
  });

  elements.stickyPracticeButtons.addEventListener("change", (event) => {
    state.settings.stickyPracticeButtons = event.target.checked;
    saveState();
    applyStickyPracticeButtons();
  });

  elements.driveLogin.addEventListener("click", () => {
    signInWithGoogle();
  });

  elements.driveSync.addEventListener("click", async () => {
    await syncWithDrive();
  });
}

function setTheme(theme) {
  state.settings.theme = theme;
  saveState();
  applyTheme(theme);
}

function applyTheme(theme) {
  const normalized = normalizeTheme(theme);
  document.documentElement.setAttribute("data-theme", normalized);
  if (elements.themeChips) {
    elements.themeChips.querySelectorAll(".theme-chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.theme === normalized);
    });
  }
}

function normalizeTheme(theme) {
  if (theme === "dark") return "cyber";
  if (theme === "light") return "clean";
  return theme || "clean";
}

function applyLanguage() {
  const lang = state.settings.language || "fa";
  const dir = lang === "fa" ? "rtl" : "ltr";
  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    element.placeholder = t(key);
  });
  document.querySelectorAll("[data-dir='target']").forEach((element) => {
    element.classList.toggle("dir-rtl", lang === "fa");
    element.classList.toggle("dir-ltr", lang !== "fa");
  });
  document.querySelectorAll("[data-show-english]").forEach((element) => {
    element.classList.toggle("hidden", lang === "en");
  });
}

function getLanguageName(lang) {
  if (lang === "en") return "English";
  if (lang === "nl") return "Dutch";
  return "Persian";
}

function getTargetDirClass() {
  const lang = state.settings.language || "fa";
  return lang === "fa" ? "dir-rtl" : "dir-ltr";
}

function getTargetMeaning(item) {
  const lang = state.settings.language || "fa";
  if (lang === "en") {
    return item.meaningsByLang?.en || item.meaningEn || "";
  }
  if (lang === "nl") {
    return item.meaningsByLang?.nl || "";
  }
  return item.meaningsByLang?.fa || item.meaningFa || "";
}

function shouldShowEnglishMeaning() {
  return (state.settings.language || "fa") !== "en";
}

function ensureShelves() {
  const raw = state.settings.shelves;
  let shelves = Array.isArray(raw) ? raw.filter(Boolean) : [];
  if (!shelves.length) {
    shelves = [{ id: "default", name: "Default", description: "", isDefault: true }];
  }
  if (!shelves.some((shelf) => shelf.id === "default")) {
    shelves.unshift({
      id: "default",
      name: "Default",
      description: "",
      isDefault: true,
    });
  }
  state.settings.shelves = shelves.map((shelf) => ({
    id: shelf.id,
    name: shelf.name || "Default",
    description: shelf.description || "",
    isDefault: shelf.id === "default" || shelf.isDefault,
  }));
  if (!state.settings.activeShelfId) {
    state.settings.activeShelfId = "default";
  }
  if (!state.settings.shelves.some((s) => s.id === state.settings.activeShelfId)) {
    state.settings.activeShelfId = "default";
  }
  state.words.forEach((word) => {
    if (!word.shelfId) word.shelfId = "default";
  });
  saveState();
}

function getActiveShelfId() {
  return state.settings.activeShelfId || "default";
}

function createShelf({ name, description = "" }) {
  const id = `shelf-${Date.now().toString(36)}-${Math.random()
    .toString(16)
    .slice(2, 6)}`;
  const shelf = { id, name, description, isDefault: false };
  state.settings.shelves.push(shelf);
  state.settings.activeShelfId = id;
  saveState();
  return shelf;
}

function removeShelf(shelfId) {
  if (shelfId === "default") return;
  state.settings.shelves = state.settings.shelves.filter((s) => s.id !== shelfId);
  if (!state.settings.shelves.length) {
    state.settings.shelves = [
      { id: "default", name: "Default", description: "", isDefault: true },
    ];
  }
  if (!state.settings.shelves.some((s) => s.id === "default")) {
    state.settings.shelves.unshift({
      id: "default",
      name: "Default",
      description: "",
      isDefault: true,
    });
  }
  if (
    state.settings.activeShelfId === shelfId ||
    !state.settings.shelves.some((s) => s.id === state.settings.activeShelfId)
  ) {
    state.settings.activeShelfId = "default";
  }
  state.words.forEach((word) => {
    if (word.shelfId === shelfId) {
      word.shelfId = "default";
    }
  });
  saveState();
}

function renderShelfSelect() {
  if (!elements.shelfSelect) return;
  elements.shelfSelect.innerHTML = "";
  state.settings.shelves.forEach((shelf) => {
    const option = document.createElement("option");
    option.value = shelf.id;
    option.textContent = shelf.name;
    elements.shelfSelect.appendChild(option);
  });
  elements.shelfSelect.value = getActiveShelfId();
}

function renderShelfList() {
  if (!elements.shelfList) return;
  elements.shelfList.innerHTML = "";
  state.settings.shelves.forEach((shelf) => {
    const row = document.createElement("div");
    row.className = "shelf-item";
    const name = document.createElement("div");
    name.className = "shelf-name";
    name.textContent = shelf.name;
    const description = document.createElement("div");
    description.className = "shelf-desc";
    description.textContent = shelf.description || "";
    const actions = document.createElement("div");
    actions.className = "shelf-actions";
    const removeButton = document.createElement("button");
    removeButton.textContent = "حذف";
    removeButton.disabled = shelf.id === "default";
    removeButton.addEventListener("click", () => {
      const count = state.words.filter((word) => word.shelfId === shelf.id).length;
      const confirmed = window.confirm(
        t("confirm_remove_shelf", { count })
      );
      if (!confirmed) return;
      removeShelf(shelf.id);
      renderShelfSelect();
      renderShelfList();
      renderWords();
    });
    actions.appendChild(removeButton);
    row.appendChild(name);
    row.appendChild(description);
    row.appendChild(actions);
    elements.shelfList.appendChild(row);
  });
}

async function generateShelfWords(topic, level, count, language) {
  const targetLanguage = getLanguageName(language || state.settings.language);
  const prompt = [
    "You are a vocabulary list generator.",
    `Return ONLY valid JSON as an array of unique ${targetLanguage} words.`,
    `Topic: ${topic}`,
    `Level: ${level}`,
    `Count: ${count}`,
  ].join("\n");

  const maxOutputTokens = Math.min(2048, 64 + count * 8);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      state.settings.model
    )}:generateContent?key=${encodeURIComponent(state.settings.apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(buildApiError("Custom shelf", response.status, errorText));
  }

  const result = await response.json();
  const text =
    result.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") ||
    "";
  let jsonText;
  try {
    jsonText = extractJsonFromText(text);
  } catch (error) {
    throw new Error(buildApiError("Custom shelf", response.status, text));
  }
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(buildApiError("Custom shelf", response.status, jsonText));
  }
  if (Array.isArray(parsed)) {
    return parsed.map((word) => String(word || "").trim()).filter(Boolean);
  }
  if (parsed && typeof parsed === "object" && Array.isArray(parsed.words)) {
    return parsed.words.map((word) => String(word || "").trim()).filter(Boolean);
  }
  const fallback = text
    .split(/[\n,]/)
    .map((word) => word.replace(/^\d+[\).:\-]\s*/, "").trim())
    .filter((word) => /^[A-Za-z-]{3,}$/.test(word));
  return Array.from(new Set(fallback)).slice(0, count);
}

function setCardTheme(theme) {
  state.settings.cardTheme = theme || "inherit";
  saveState();
  applyCardTheme(state.settings.cardTheme);
  renderWords();
}

function applyCardTheme(theme) {
  const normalized = theme || "inherit";
  if (elements.cardThemeChips) {
    elements.cardThemeChips.querySelectorAll(".theme-chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.cardTheme === normalized);
    });
  }
  if (elements.cardThemeControls) {
    elements.cardThemeControls.classList.toggle(
      "hidden",
      normalized !== "soft-custom"
    );
  }
  if (elements.cardThemePreview) {
    if (normalized === "inherit") {
      elements.cardThemePreview.removeAttribute("data-card-theme");
    } else {
      elements.cardThemePreview.dataset.cardTheme = normalized;
    }
    applyCardCustomStyles(elements.cardThemePreview);
  }
}

function applyCardCustomInputs() {
  if (elements.cardTitleColor) {
    elements.cardTitleColor.value = state.settings.cardCustom.titleColor;
  }
  if (elements.cardTextColor) {
    elements.cardTextColor.value = state.settings.cardCustom.textColor;
  }
  if (elements.cardBgColor) {
    elements.cardBgColor.value = state.settings.cardCustom.bgColor;
  }
}

function updateCardCustomColors() {
  state.settings.cardCustom = {
    titleColor: elements.cardTitleColor.value,
    textColor: elements.cardTextColor.value,
    bgColor: elements.cardBgColor.value,
  };
  saveState();
  renderWords();
  if (elements.cardThemePreview) {
    applyCardCustomStyles(elements.cardThemePreview);
  }
}

function applyCardCustomStyles(element) {
  if (!element) return;
  if (state.settings.cardTheme !== "soft-custom") {
    element.style.removeProperty("--card-title-color");
    element.style.removeProperty("--card-label-color");
    element.style.removeProperty("--card-value-color");
    element.style.removeProperty("--card-bg-color");
    return;
  }
  element.style.setProperty("--card-title-color", state.settings.cardCustom.titleColor);
  element.style.setProperty("--card-label-color", state.settings.cardCustom.textColor);
  element.style.setProperty("--card-value-color", state.settings.cardCustom.textColor);
  element.style.setProperty("--card-bg-color", state.settings.cardCustom.bgColor);
}

function applyStickyPracticeButtons() {
  if (elements.stickyPracticeButtons) {
    elements.stickyPracticeButtons.checked = state.settings.stickyPracticeButtons;
  }
  if (elements.practiceActions) {
    elements.practiceActions.classList.toggle(
      "sticky",
      state.settings.stickyPracticeButtons
    );
  }
  if (elements.practiceCard) {
    elements.practiceCard.classList.toggle(
      "sticky-actions",
      state.settings.stickyPracticeButtons
    );
  }
}

function showSettingsPage(pageId) {
  if (elements.settingsMenu) {
    elements.settingsMenu.classList.toggle("hidden", Boolean(pageId));
  }
  if (elements.settingsBack) {
    elements.settingsBack.classList.toggle("hidden", !pageId);
  }
  elements.settingsPages.forEach((page) => {
    page.classList.toggle("active", page.dataset.settingsPage === pageId);
  });
}

function setActiveTab(tabId) {
  elements.tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabId);
  });
  elements.panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
  if (tabId === "practice") {
    refreshPracticeDeck();
    renderPractice();
  }
  if (tabId === "settings") {
    showSettingsPage(null);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      settings: {
        ...structuredClone(defaultState.settings),
        ...(parsed.settings || {}),
      },
    };
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeWord(word) {
  return word.trim().toLowerCase();
}

function extractWordsFromJson(data) {
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") return item.word || "";
        return "";
      })
      .filter(Boolean);
  }
  if (data && typeof data === "object" && Array.isArray(data.words)) {
    return extractWordsFromJson(data.words);
  }
  return [];
}

function addCardsFromJson(data) {
  const cards = Array.isArray(data)
    ? data
    : data && Array.isArray(data.words)
    ? data.words
    : [];

  let added = 0;
  let skipped = 0;
  cards.forEach((card) => {
    if (!card || typeof card !== "object") return;
    const word = (card.word || "").trim();
    if (!word) return;
    const key = normalizeWord(word);
    const exists = state.words.some((item) => normalizeWord(item.word) === key);
    if (exists) {
      skipped += 1;
      return;
    }
    const normalized = normalizeCard({
      ...card,
      word,
      shelfId: card.shelfId || getActiveShelfId(),
    });
    normalized.id = crypto.randomUUID();
    normalized.createdAt = normalized.createdAt || new Date().toISOString();
    normalized.updatedAt = new Date().toISOString();
    normalized.synced = isCardComplete(normalized);
    state.words.push(normalized);
    added += 1;
  });

  if (added > 0) {
    saveState();
    renderWords();
    refreshPracticeDeck();
    renderPractice();
  }
  return { added, skipped };
}

function addWords(list, shelfId = getActiveShelfId()) {
  let added = 0;
  list.forEach((word) => {
    const trimmed = word.trim();
    if (!trimmed) return;
    const key = normalizeWord(trimmed);
    const exists = state.words.some((item) => normalizeWord(item.word) === key);
    if (exists) return;
    state.words.push({
      id: crypto.randomUUID(),
      word: trimmed,
      shelfId,
      meaningFa: "",
      meaningEn: "",
      meaningsByLang: { fa: "", en: "", nl: "" },
      pronunciation: "",
      example: "",
      synonyms: [],
      box: 1,
      synced: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    added += 1;
  });
  if (added > 0) {
    saveState();
    renderWords();
    refreshPracticeDeck();
    renderPractice();
  }
  return added;
}

async function addWordsWithCorrection(list, shelfId = getActiveShelfId()) {
  const cleaned = list.map((word) => word.trim()).filter(Boolean);
  if (!cleaned.length) return 0;
  if (!state.settings.apiKey) {
    return addWords(cleaned, shelfId);
  }
  try {
    const corrected = await correctWordsBatch(cleaned);
    return addWords(corrected, shelfId);
  } catch (error) {
    console.error(error);
    return addWords(cleaned, shelfId);
  }
}

function renderWords() {
  if (!state.words.length) {
    elements.wordList.innerHTML = "<p class='empty-state'>هیچ لغتی وجود ندارد.</p>";
    return;
  }
  const activeShelfId = getActiveShelfId();
  const visibleWords = state.words.filter(
    (item) => (item.shelfId || "default") === activeShelfId
  );
  if (!visibleWords.length) {
    elements.wordList.innerHTML =
      "<p class='empty-state'>در این شلف لغتی وجود ندارد.</p>";
    return;
  }
  elements.wordList.innerHTML = "";
  const sortedWords = [...visibleWords].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  sortedWords.forEach((item) => {
    const container = document.createElement("div");
    container.className = "word-item";
    if (state.settings.cardTheme && state.settings.cardTheme !== "inherit") {
      container.dataset.cardTheme = state.settings.cardTheme;
    } else {
      container.removeAttribute("data-card-theme");
    }
    applyCardCustomStyles(container);

    const header = document.createElement("header");
    header.className = "word-header";
    const title = document.createElement("h3");
    title.textContent = item.word;
    title.className = "word-title dir-ltr";
    header.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "word-meta";
    const targetMeaning = getTargetMeaning(item) || "—";
    const englishMeaning = item.meaningsByLang?.en || item.meaningEn || "—";
    meta.innerHTML = `
      <div class="word-meta-item">
        <span class="meta-label">${t("meaning_target")}</span>
        <span class="meta-value ${getTargetDirClass()}">${targetMeaning}</span>
      </div>
      ${
        shouldShowEnglishMeaning()
          ? `<div class="word-meta-item">
              <span class="meta-label">${t("meaning_english")}</span>
              <span class="meta-value dir-ltr">${englishMeaning}</span>
            </div>`
          : ""
      }
      <div class="word-meta-item">
        <span class="meta-label">${t("pronunciation")}</span>
        <span class="meta-value dir-ltr">${item.pronunciation || "—"}</span>
      </div>
      <div class="word-meta-item">
        <span class="meta-label">${t("example")}</span>
        <span class="meta-value dir-ltr">${item.example || "—"}</span>
      </div>
      <div class="word-meta-item">
        <span class="meta-label">${t("synonyms")}</span>
        <span class="meta-value dir-ltr">${
          item.synonyms?.length ? item.synonyms.join(", ") : "—"
        }</span>
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "word-actions";

    const pronounceButton = document.createElement("button");
    pronounceButton.textContent = t("play_pronunciation");
    pronounceButton.addEventListener("click", () => {
      speakWord(item.word);
    });

    if (item.suggestion) {
      const suggestionRow = document.createElement("div");
      suggestionRow.className = "word-suggestion";
      const suggestionText = document.createElement("span");
      suggestionText.textContent = `${t("correction_title")} ${item.suggestion}`;
      const copyButton = document.createElement("button");
      copyButton.textContent = t("correction_copy");
      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(item.suggestion);
        } catch (error) {
          console.error(error);
        }
      });
      const replaceButton = document.createElement("button");
      replaceButton.textContent = t("correction_action");
      replaceButton.addEventListener("click", () => {
        const added = addWords([item.suggestion], item.shelfId || "default");
        if (added > 0) {
          state.words = state.words.filter((word) => word.id !== item.id);
          saveState();
          renderWords();
          refreshPracticeDeck();
          renderPractice();
          setStatus(t("correction_added"));
        }
      });
      suggestionRow.appendChild(suggestionText);
      suggestionRow.appendChild(copyButton);
      suggestionRow.appendChild(replaceButton);
      actions.appendChild(suggestionRow);
    }

    const shelfSelect = document.createElement("select");
    shelfSelect.className = "shelf-select";
    state.settings.shelves.forEach((shelf) => {
      const option = document.createElement("option");
      option.value = shelf.id;
      option.textContent = shelf.name;
      shelfSelect.appendChild(option);
    });
    shelfSelect.value = item.shelfId || "default";
    shelfSelect.addEventListener("change", (event) => {
      item.shelfId = event.target.value;
      item.updatedAt = new Date().toISOString();
      saveState();
      renderWords();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-word";
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => {
      const confirmed = window.confirm(t("confirm_delete"));
      if (!confirmed) return;
      state.words = state.words.filter((word) => word.id !== item.id);
      saveState();
      renderWords();
      refreshPracticeDeck();
      renderPractice();
    });

    header.appendChild(deleteButton);

    container.appendChild(header);
    container.appendChild(meta);
    actions.appendChild(pronounceButton);
    actions.appendChild(shelfSelect);
    container.appendChild(actions);

    elements.wordList.appendChild(container);
  });
}

async function syncAllWords() {
  if (!state.settings.apiKey) {
    setStatus(t("api_key_required"));
    setActiveTab("settings");
    return;
  }

  const pending = state.words.filter((item) => !isCardComplete(item));
  if (!pending.length) {
    setStatus(t("sync_all_none"));
    return;
  }

  elements.syncWords.disabled = true;
  setStatus(t("sync_in_progress", { count: pending.length }));
  try {
    let correctionMap = new Map();
    try {
      const corrected = await correctWordsBatch(pending.map((item) => item.word));
      correctionMap = new Map(
        pending.map((item, index) => [
          normalizeWord(item.word),
          corrected[index]?.trim() || item.word,
        ])
      );
    } catch (error) {
      console.error(error);
    }

    const batchData = await generateCardBatchData(pending.map((item) => item.word));
    const normalized = new Map(
      batchData.map((entry) => [normalizeWord(entry.word || ""), entry])
    );

    let updatedCount = 0;
    pending.forEach((item) => {
      const data = normalized.get(normalizeWord(item.word));
      if (!data) return;
      const meanings = data.meanings || data.meaningsByLang || {};
      item.meaningFa = meanings.fa || data.meaningFa || item.meaningFa;
      item.meaningEn = meanings.en || data.meaningEn || item.meaningEn;
      item.meaningsByLang = {
        fa: meanings.fa || item.meaningsByLang?.fa || item.meaningFa || "",
        en: meanings.en || item.meaningsByLang?.en || item.meaningEn || "",
        nl: meanings.nl || item.meaningsByLang?.nl || "",
      };
      item.pronunciation = data.pronunciation || item.pronunciation;
      item.example = data.example || item.example;
      item.synonyms = Array.isArray(data.synonyms) ? data.synonyms : item.synonyms;
      const suggested = correctionMap.get(normalizeWord(item.word));
      if (suggested && normalizeWord(suggested) !== normalizeWord(item.word)) {
        item.suggestion = suggested;
      } else {
        item.suggestion = "";
      }
      item.synced = isCardComplete(item);
      item.updatedAt = new Date().toISOString();
      updatedCount += 1;
    });

    saveState();
    renderWords();
    const missing = pending.length - updatedCount;
    setStatus(
      missing ? t("sync_partial", { missing }) : t("sync_done")
    );
  } catch (error) {
    console.error(error);
    setStatus(error.message || t("sync_error"));
  }
  elements.syncWords.disabled = false;
  refreshPracticeDeck();
  renderPractice();
}

async function generateCardBatchData(words) {
  const prompt = [
    "You are a dictionary assistant.",
    "Return ONLY valid JSON as a single array. No prose, no markdown, no code fences.",
    "For each word, provide meanings for these target languages: Persian (fa), English (en), Dutch (nl).",
    "Each item must include: word, meanings { fa, en, nl }, pronunciation (IPA or phonetic in English), example (English sentence), synonyms (array of English synonyms).",
    "If a word is unknown, still return it with empty strings and empty synonyms array.",
    `Words: ${JSON.stringify(words)}`,
  ].join("\n");

  const maxOutputTokens = Math.min(4096, 256 + words.length * 140);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      state.settings.model
    )}:generateContent?key=${encodeURIComponent(state.settings.apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(buildApiError("Meaning sync", response.status, errorText));
  }

  const result = await response.json();
  const text =
    result.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") ||
    "";
  let jsonText;
  try {
    jsonText = extractJsonFromText(text);
  } catch (error) {
    throw new Error(buildApiError("Meaning sync", response.status, text));
  }
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(buildApiError("Meaning sync", response.status, jsonText));
  }
  if (!Array.isArray(parsed)) {
    throw new Error(buildApiError("Meaning sync", response.status, jsonText));
  }
  return parsed;
}

async function correctWordsBatch(words) {
  const prompt = [
    "You are a spelling corrector for English words.",
    "Return ONLY valid JSON as an array of objects with keys: input, corrected.",
    "If the input is already correct, return it unchanged.",
    `Words: ${JSON.stringify(words)}`,
  ].join("\n");

  const maxOutputTokens = Math.min(2048, 128 + words.length * 30);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      state.settings.model
    )}:generateContent?key=${encodeURIComponent(state.settings.apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(buildApiError("Spell check", response.status, errorText));
  }

  const result = await response.json();
  const text =
    result.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") ||
    "";
  let jsonText;
  try {
    jsonText = extractJsonFromText(text);
  } catch (error) {
    throw new Error(buildApiError("Spell check", response.status, text));
  }
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(buildApiError("Spell check", response.status, jsonText));
  }
  if (!Array.isArray(parsed)) {
    throw new Error(buildApiError("Spell check", response.status, jsonText));
  }

  const mapping = new Map(
    parsed.map((entry) => [normalizeWord(entry.input || ""), entry.corrected])
  );
  return words.map((word) => {
    const key = normalizeWord(word);
    const corrected = mapping.get(key);
    return (corrected || word).trim();
  });
}

function extractJsonFromText(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    throw new Error("Empty response text");
  }

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch?.[1]) {
    return fenceMatch[1].trim();
  }

  const firstBracket = trimmed.indexOf("[");
  const lastBracket = trimmed.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket !== -1) {
    return trimmed.slice(firstBracket, lastBracket + 1);
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("No JSON found in response");
}

function buildApiError(context, status, raw) {
  const cleaned = String(raw || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
  return `${context} error (${status}): ${cleaned || "Empty response"}`;
}

function isCardComplete(item) {
  return Boolean(
    (item.meaningsByLang?.fa || item.meaningFa) &&
      (item.meaningsByLang?.en || item.meaningEn) &&
      item.meaningsByLang?.nl &&
      item.pronunciation &&
      item.example &&
      Array.isArray(item.synonyms) &&
      item.synonyms.length
  );
}

function refreshPracticeDeck() {
  if (!state.words.length) {
    practiceState = {
      deck: [],
      currentIndex: 0,
      showAnswer: false,
      activeBox: practiceState.activeBox || null,
      currentBoxIndex: practiceState.currentBoxIndex || 0,
    };
    return;
  }
  const activeBox = practiceState.activeBox || null;
  const allBoxes = [1, 2, 3, 4, 5];
  if (activeBox) {
    const deck = shuffle(state.words.filter((word) => word.box === activeBox));
    practiceState = {
      deck,
      currentIndex: 0,
      showAnswer: false,
      activeBox,
      currentBoxIndex: practiceState.currentBoxIndex || 0,
    };
    return;
  }

  const startIndex = practiceState.currentBoxIndex || 0;
  let nextIndex = -1;
  for (let i = 0; i < allBoxes.length; i += 1) {
    const index = (startIndex + i) % allBoxes.length;
    const box = allBoxes[index];
    if (state.words.some((word) => word.box === box)) {
      nextIndex = index;
      break;
    }
  }

  if (nextIndex === -1) {
    practiceState = {
      deck: [],
      currentIndex: 0,
      showAnswer: false,
      activeBox: null,
      currentBoxIndex: 0,
    };
    return;
  }

  const selectedBox = allBoxes[nextIndex];
  const deck = shuffle(state.words.filter((word) => word.box === selectedBox));
  practiceState = {
    deck,
    currentIndex: 0,
    showAnswer: false,
    activeBox: null,
    currentBoxIndex: nextIndex,
  };
}

function renderPractice() {
  if (!practiceState.deck.length) {
    if (!state.words.length) {
      elements.practiceEmpty.classList.remove("hidden");
      elements.practiceCard.classList.add("hidden");
      return;
    }
    elements.practiceEmpty.classList.add("hidden");
    elements.practiceCard.classList.remove("hidden");
    renderG5Boxes();
    elements.practiceFlip.classList.remove("flipped");
    elements.practiceDetails.innerHTML = "";
    elements.practiceWord.textContent = t("practice_done");
    if (elements.practiceProgressFill) {
      elements.practiceProgressFill.style.width = "100%";
    }
    updateFlipHeight();
    return;
  }

  elements.practiceEmpty.classList.add("hidden");
  elements.practiceCard.classList.remove("hidden");
  renderG5Boxes();

  const current = practiceState.deck[practiceState.currentIndex];
  elements.practiceWord.textContent = current.word;
  applyPracticeCardTheme();

  const targetMeaning = getTargetMeaning(current) || "—";
  const englishMeaning = current.meaningsByLang?.en || current.meaningEn || "—";
  const details = `
    <header class="word-header">
      <h3 class="word-title dir-ltr">${current.word}</h3>
    </header>
    <div class="word-meta">
      <div class="word-meta-item">
        <span class="meta-label">${t("meaning_target")}</span>
        <span class="meta-value ${getTargetDirClass()}">${targetMeaning}</span>
      </div>
      ${
        shouldShowEnglishMeaning()
          ? `<div class="word-meta-item">
              <span class="meta-label">${t("meaning_english")}</span>
              <span class="meta-value dir-ltr">${englishMeaning}</span>
            </div>`
          : ""
      }
      <div class="word-meta-item">
        <span class="meta-label">${t("pronunciation")}</span>
        <span class="meta-value dir-ltr">${current.pronunciation || "—"}</span>
      </div>
      <div class="word-meta-item">
        <span class="meta-label">${t("example")}</span>
        <span class="meta-value dir-ltr">${current.example || "—"}</span>
      </div>
      <div class="word-meta-item">
        <span class="meta-label">${t("synonyms")}</span>
        <span class="meta-value dir-ltr">${
          current.synonyms?.length ? current.synonyms.join(", ") : "—"
        }</span>
      </div>
    </div>
  `;

  elements.practiceDetails.innerHTML = details;
  elements.practiceFlip.classList.toggle("flipped", practiceState.showAnswer);
  if (elements.practiceProgressFill) {
    const ratio = (practiceState.currentIndex + 1) / practiceState.deck.length;
    elements.practiceProgressFill.style.width = `${Math.round(ratio * 100)}%`;
  }
  updateFlipHeight();

  elements.practiceProgress.textContent = t("practice_progress", {
    current: practiceState.currentIndex + 1,
    total: practiceState.deck.length,
  });
}

function renderG5Boxes() {
  if (!elements.g5Boxes) return;
  if (elements.g5BoxesReset) {
    elements.g5BoxesReset.classList.toggle(
      "active",
      !practiceState.activeBox
    );
  }
  const counts = [1, 2, 3, 4, 5].map(
    (box) => state.words.filter((word) => word.box === box).length
  );
  elements.g5Boxes.innerHTML = counts
    .map((count, index) => {
      const box = index + 1;
      const isActive = practiceState.activeBox === box;
      return `
        <button class="g5-box ${isActive ? "active" : ""}" data-box="${box}">
          <i class="fa-solid fa-box"></i>
          <span>${box}</span>
        </button>
      `;
    })
    .join("");
  if (elements.g5Counts) {
    if (practiceState.activeBox) {
      const count = counts[practiceState.activeBox - 1] || 0;
      elements.g5Counts.textContent = t("word_counts_box", {
        box: practiceState.activeBox,
        count,
      });
    } else {
      const total = counts.reduce((sum, value) => sum + value, 0);
      elements.g5Counts.textContent = t("word_counts_all", { total });
    }
  }
}

function applyPracticeCardTheme() {
  const theme = state.settings.cardTheme;
  const targets = [elements.practiceFrontCard, elements.practiceDetails];
  targets.forEach((element) => {
    if (!element) return;
    if (theme && theme !== "inherit") {
      element.dataset.cardTheme = theme;
    } else {
      element.removeAttribute("data-card-theme");
    }
    applyCardCustomStyles(element);
  });
}

function updateFlipHeight() {
  if (!elements.practiceFlip) return;
  requestAnimationFrame(() => {
    const front = elements.practiceFrontCard?.offsetHeight || 0;
    const back = elements.practiceDetails?.offsetHeight || 0;
    const targetHeight = practiceState.showAnswer ? back : front;
    const minBase = 220;
    elements.practiceFlip.style.minHeight = `${Math.max(targetHeight, minBase)}px`;
  });
}

function advancePractice() {
  practiceState.currentIndex += 1;
  practiceState.showAnswer = false;
  if (practiceState.currentIndex < practiceState.deck.length) {
    renderPractice();
    return;
  }
  if (practiceState.activeBox) {
    practiceState.deck = [];
    practiceState.currentIndex = 0;
    renderPractice();
    return;
  }
  practiceState.currentBoxIndex = (practiceState.currentBoxIndex + 1) % 5;
  refreshPracticeDeck();
  renderPractice();
}

function goToNextCard() {
  if (!practiceState.deck.length) return;
  advancePractice();
}

function goToPrevCard() {
  if (!practiceState.deck.length) return;
  practiceState.currentIndex = Math.max(0, practiceState.currentIndex - 1);
  practiceState.showAnswer = false;
  renderPractice();
}

function updatePracticeResult(isKnown) {
  if (!practiceState.deck.length) return;
  const current = practiceState.deck[practiceState.currentIndex];
  if (isKnown) {
    current.box = Math.min(5, current.box + 1);
  } else {
    current.box = 1;
  }
  current.updatedAt = new Date().toISOString();
  saveState();
  renderWords();

  advancePractice();
}

function shuffle(list) {
  const array = [...list];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function setStatus(message) {
  elements.syncStatus.textContent = message;
  window.clearTimeout(setStatus.timeoutId);
  setStatus.timeoutId = window.setTimeout(() => {
    elements.syncStatus.textContent = "";
  }, 4000);
}

function setDriveStatus(message) {
  if (!elements.driveStatus) return;
  elements.driveStatus.textContent = message;
  window.clearTimeout(setDriveStatus.timeoutId);
  setDriveStatus.timeoutId = window.setTimeout(() => {
    elements.driveStatus.textContent = "";
  }, 5000);
}

function setCustomShelfStatus(message) {
  if (!elements.customShelfStatus) return;
  elements.customShelfStatus.textContent = message;
  window.clearTimeout(setCustomShelfStatus.timeoutId);
  setCustomShelfStatus.timeoutId = window.setTimeout(() => {
    elements.customShelfStatus.textContent = "";
  }, 6000);
}

function signInWithGoogle() {
  if (!state.settings.driveClientId) {
    setDriveStatus(t("drive_need_client"));
    setActiveTab("settings");
    return;
  }
  if (!window.google?.accounts?.oauth2) {
    setDriveStatus(t("drive_lib_not_loaded"));
    return;
  }

  if (!driveAuth.tokenClient) {
    driveAuth.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: state.settings.driveClientId,
      scope: "https://www.googleapis.com/auth/drive.file",
      callback: (tokenResponse) => {
        if (tokenResponse?.access_token) {
          driveAuth.accessToken = tokenResponse.access_token;
          driveAuth.expiresAt = Date.now() + tokenResponse.expires_in * 1000;
          setDriveStatus(t("drive_login_ok"));
        } else {
          setDriveStatus(t("drive_login_fail"));
        }
      },
    });
  }

  driveAuth.tokenClient.requestAccessToken({ prompt: "consent" });
}

function hasValidDriveToken() {
  return driveAuth.accessToken && Date.now() < driveAuth.expiresAt;
}

async function syncWithDrive() {
  if (!hasValidDriveToken()) {
    setDriveStatus(t("drive_need_login"));
    return;
  }

  elements.driveSync.disabled = true;
  setDriveStatus(t("drive_syncing"));
  try {
    const fileId = await resolveDriveFileId();
    let remoteCards = [];

    if (fileId) {
      const downloaded = await downloadDriveFile(fileId);
      remoteCards = extractCardsFromDrive(downloaded);
    }

    const merged = mergeCards(state.words, remoteCards);
    state.words = merged;
    saveState();
    renderWords();
    refreshPracticeDeck();
    renderPractice();

    const finalFileId = fileId || (await createDriveFile());
    await uploadDriveFile(finalFileId, state.words);
    state.settings.driveFileId = finalFileId;
    elements.driveFileId.value = finalFileId;
    saveState();
    setDriveStatus(t("drive_sync_done"));
  } catch (error) {
    console.error(error);
    setDriveStatus(t("drive_sync_error"));
  }
  elements.driveSync.disabled = false;
}

async function resolveDriveFileId() {
  if (state.settings.driveFileId) return state.settings.driveFileId;
  const fileName = state.settings.driveFileName || "lingopop-cards.json";
  const query = encodeURIComponent(
    `name='${fileName.replace(/'/g, "\\'")}' and trashed=false`
  );
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&pageSize=1&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${driveAuth.accessToken}` },
    }
  );
  if (!response.ok) {
    throw new Error("Drive list failed");
  }
  const data = await response.json();
  return data.files?.[0]?.id || "";
}

async function downloadDriveFile(fileId) {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
      fileId
    )}?alt=media`,
    {
      headers: { Authorization: `Bearer ${driveAuth.accessToken}` },
    }
  );
  if (!response.ok) {
    throw new Error("Drive download failed");
  }
  return response.json();
}

function extractCardsFromDrive(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.words)) return payload.words;
  return [];
}

function mergeCards(localCards, remoteCards) {
  const merged = new Map();
  localCards.forEach((card) => {
    merged.set(normalizeWord(card.word), normalizeCard(card));
  });

  remoteCards.forEach((card) => {
    const normalized = normalizeCard(card);
    const key = normalizeWord(normalized.word);
    if (!key) return;
    if (!merged.has(key)) {
      merged.set(key, normalized);
      return;
    }

    const existing = merged.get(key);
    merged.set(key, preferMoreComplete(existing, normalized));
  });

  return Array.from(merged.values());
}

function normalizeCard(card) {
  const fallback = createEmptyCard(card.word || "");
  const meanings =
    card.meaningsByLang && typeof card.meaningsByLang === "object"
      ? card.meaningsByLang
      : {};
  return {
    ...fallback,
    ...card,
    synonyms: Array.isArray(card.synonyms) ? card.synonyms : fallback.synonyms,
    box: Number.isFinite(card.box) ? card.box : fallback.box,
    word: card.word || fallback.word,
    pronunciation: card.pronunciation || fallback.pronunciation,
    shelfId: card.shelfId || fallback.shelfId,
    suggestion: card.suggestion || fallback.suggestion,
    meaningsByLang: {
      fa: meanings.fa || card.meaningFa || fallback.meaningsByLang.fa,
      en: meanings.en || card.meaningEn || fallback.meaningsByLang.en,
      nl: meanings.nl || fallback.meaningsByLang.nl,
    },
  };
}

function createEmptyCard(word) {
  return {
    id: cardId(word),
    word: word || "",
    shelfId: "default",
    meaningFa: "",
    meaningEn: "",
    meaningsByLang: { fa: "", en: "", nl: "" },
    suggestion: "",
    suggestion: "",
    pronunciation: "",
    example: "",
    synonyms: [],
    box: 1,
    synced: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function cardId(word) {
  return `drive-${normalizeWord(word)}-${Math.random().toString(16).slice(2, 8)}`;
}

function preferMoreComplete(local, remote) {
  const localScore = cardCompletenessScore(local);
  const remoteScore = cardCompletenessScore(remote);
  const winner = remoteScore > localScore ? remote : local;
  return {
    ...winner,
    id: local.id || remote.id,
    createdAt: local.createdAt || remote.createdAt,
    updatedAt: winner.updatedAt || new Date().toISOString(),
    synced: isCardComplete(winner),
  };
}

function cardCompletenessScore(card) {
  let score = 0;
  if (card.meaningFa) score += 1;
  if (card.meaningEn) score += 1;
  if (card.pronunciation) score += 1;
  if (card.example) score += 1;
  if (Array.isArray(card.synonyms) && card.synonyms.length) score += 1;
  return score;
}

function speakWord(word) {
  if (!word) return;
  if (!("speechSynthesis" in window)) {
    setStatus(t("speech_not_supported"));
    return;
  }
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

async function createDriveFile() {
  const fileName = state.settings.driveFileName || "lingopop-cards.json";
  const response = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${driveAuth.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: fileName,
      mimeType: "application/json",
    }),
  });
  if (!response.ok) {
    throw new Error("Drive create failed");
  }
  const data = await response.json();
  return data.id;
}

async function uploadDriveFile(fileId, payload) {
  const response = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(
      fileId
    )}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${driveAuth.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload, null, 2),
    }
  );
  if (!response.ok) {
    throw new Error("Drive upload failed");
  }
}
