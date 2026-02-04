const STORAGE_KEY = "lingopop_state_v1";

const defaultState = {
  words: [],
  settings: {
    apiKey: "",
    model: "gemini-flash-latest",
    syncBatchSize: 20,
    cooldownSeconds: 2,
    driveClientId: "",
    driveFileName: "lingopop-cards.json",
    driveFileId: "",
    theme: "sepia",
    cardTheme: "inherit",
    cardCustom: {
      titleColor: "#2f2f37",
      textColor: "#3f3f4a",
      bgColor: "#ffffff",
    },
    stickyPracticeButtons: true,
    language: "fa",
    shelves: [
      { id: "default", name: "تمامی لغات", description: "", isDefault: true },
    ],
    activeShelfId: "default",
    practiceLanguage: "fa",
    practiceShelfId: "default",
    practiceStarted: false,
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

let shelfSheetTargetId = null;

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
    practice_section: "بخش تمرین",
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
    io_mode_label: "نوع فایل",
    io_words_only: "فقط لغت‌ها",
    io_words_meanings: "لغت‌ها با معنی",
    io_cards_no_shelf: "همه کارت‌ها بدون شلف",
    io_cards_with_shelf: "همه کارت‌ها با شلف",
    io_import_btn: "ورود فایل",
    io_export_btn: "خروجی فایل",
    io_mode_hint: "پیش‌فرض: لغت‌ها با ترجمه و در شلف خودش",
    copy_all_words: "کپی همه لغت‌ها",
    copy_shelf_words: "کپی لغت‌های یک شلف",
    copy_btn: "کپی",
    words_shelf_export: "خروجی لغت‌ها با شلف",
    words_shelf_import: "ورود لغت‌ها با شلف",
    words_shelf_import_hint:
      "فرمت: { shelves: [{ name, description, words: [] }] } یا آرایه‌ای از { word, shelf }.",
    words_shelf_imported: "{count} لغت وارد شد.",
    shelf_list_title: "شلف‌ها",
    shelf_word_count: "تعداد لغت‌ها: {count}",
    shelf_default_name: "تمامی لغات",
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
      "LingoPop یک برنامه سبک برای مدیریت لغت و کارت‌های آموزشی است. لغت‌ها را دستی یا با فایل JSON وارد کنید، با Google API معنی، تلفظ، مثال و هم‌معنی‌ها را بسازید و با جعبه‌های G5 تمرین کنید. می‌توانید شلف‌ها بسازید، بین شلف‌ها جابه‌جا کنید، خروجی بگیرید و با Google Drive سینک کنید. همه داده‌ها به‌صورت محلی ذخیره می‌شوند.",
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
    sync_batch_label: "اندازه بچ سینک",
    sync_batch_placeholder: "20",
    sync_batch_hint:
      "برای جلوگیری از خطای API مقدار کمتر انتخاب کنید (مثلا ۱۵ تا ۲۵).",
    cooldown_label: "زمان کول‌دان (ثانیه)",
    cooldown_placeholder: "2",
    cooldown_hint: "بین درخواست‌های API مکث می‌گذارد تا خطا کمتر شود.",
    cooldown_prefix: "کول‌دان",
    api_test_ok: "اتصال به API موفق بود.",
    api_test_fail: "اتصال به API ناموفق بود.",
    api_test_word_ok: "تست لغت موفق: {word}",
    api_test_word_fail: "تست لغت ناموفق بود.",
    api_test_start: "در حال تست اتصال...",
    custom_shelf_start: "در حال ساخت شلف اختصاصی...",
    api_test_all_start: "در حال تست همه مدل‌ها...",
    api_test_all_done: "مدل‌های پیشنهادی: {models}",
    api_test_all_none: "هیچ مدل موفقی یافت نشد.",
    sync_all_none: "همه لغت‌ها کامل هستند.",
    sync_in_progress: "در حال سینک {count} لغت در یک درخواست...",
    sync_progress: "در حال سینک {done} از {total} لغت...",
    sync_partial_done: "سینک تا اینجا انجام شد: {done} از {total} لغت.",
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
    practice_section: "Practice section",
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
    io_mode_label: "File type",
    io_words_only: "Words only",
    io_words_meanings: "Words with meanings",
    io_cards_no_shelf: "All cards without shelf",
    io_cards_with_shelf: "All cards with shelf",
    io_import_btn: "Import file",
    io_export_btn: "Export file",
    io_mode_hint: "Default: words with meanings in their shelf",
    copy_all_words: "Copy all words",
    copy_shelf_words: "Copy shelf words",
    copy_btn: "Copy",
    words_shelf_export: "Export words with shelves",
    words_shelf_import: "Import words with shelves",
    words_shelf_import_hint:
      "Format: { shelves: [{ name, description, words: [] }] } or array of { word, shelf }.",
    words_shelf_imported: "{count} words imported.",
    shelf_list_title: "Shelves",
    shelf_word_count: "Words: {count}",
    shelf_default_name: "All words",
    cards_import: "Import full cards",
    cards_import_hint: "Format: array of cards with word field. Duplicates are skipped.",
    theme_title: "Appearance",
    card_theme_title: "Word card theme",
    card_preview_hint: "Word card preview",
    practice_settings_title: "Practice Settings",
    sticky_buttons_label: "Stick practice buttons to bottom",
    about_title: "About",
    about_text:
      "LingoPop is a lightweight app for vocabulary cards and G5 practice. Add words manually or via JSON, generate meanings, pronunciation, examples, and synonyms with Google API, practice with G5 boxes, organize shelves, export/import, and sync with Google Drive. All data is stored locally.",
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
    sync_batch_label: "Sync batch size",
    sync_batch_placeholder: "20",
    sync_batch_hint:
      "Use a smaller batch size to avoid API limits (e.g. 15 to 25).",
    cooldown_label: "Cooldown seconds",
    cooldown_placeholder: "2",
    cooldown_hint: "Pause between API requests to reduce errors.",
    cooldown_prefix: "Cooldown",
    api_test_ok: "API connection successful.",
    api_test_fail: "API connection failed.",
    api_test_word_ok: "Word test ok: {word}",
    api_test_word_fail: "Word test failed.",
    api_test_start: "Testing API connection...",
    custom_shelf_start: "Creating custom shelf...",
    api_test_all_start: "Testing all models...",
    api_test_all_done: "Recommended models: {models}",
    api_test_all_none: "No model passed the tests.",
    sync_all_none: "All words are complete.",
    sync_in_progress: "Syncing {count} words in one request...",
    sync_progress: "Syncing {done} of {total} words...",
    sync_partial_done: "Sync completed so far: {done} of {total} words.",
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
    practice_section: "Oefensectie",
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
    io_mode_label: "Bestandstype",
    io_words_only: "Alleen woorden",
    io_words_meanings: "Woorden met betekenissen",
    io_cards_no_shelf: "Alle kaarten zonder shelf",
    io_cards_with_shelf: "Alle kaarten met shelf",
    io_import_btn: "Bestand importeren",
    io_export_btn: "Bestand exporteren",
    io_mode_hint: "Standaard: woorden met betekenis in hun shelf",
    copy_all_words: "Kopieer alle woorden",
    copy_shelf_words: "Kopieer woorden uit shelf",
    copy_btn: "Kopiëren",
    words_shelf_export: "Woorden met shelves exporteren",
    words_shelf_import: "Woorden met shelves importeren",
    words_shelf_import_hint:
      "Formaat: { shelves: [{ name, description, words: [] }] } of array { word, shelf }.",
    words_shelf_imported: "{count} woorden geïmporteerd.",
    shelf_list_title: "Shelves",
    shelf_word_count: "Woorden: {count}",
    shelf_default_name: "Alle woorden",
    cards_import: "Volledige kaarten importeren",
    cards_import_hint: "Formaat: array kaarten met word veld. Dubbelen worden overgeslagen.",
    theme_title: "Uiterlijk",
    card_theme_title: "Kaartthema",
    card_preview_hint: "Voorbeeld kaart",
    practice_settings_title: "Oefeninstellingen",
    sticky_buttons_label: "Oefenknoppen onderaan vastzetten",
    about_title: "Over",
    about_text:
      "LingoPop is een lichte app voor woordkaarten en G5-oefenen. Voeg woorden handmatig of via JSON toe, maak betekenissen, uitspraak, voorbeelden en synoniemen met Google API, oefen met G5-boxen, beheer shelves, exporteer/importeer en synchroniseer met Google Drive. Alle data wordt lokaal opgeslagen.",
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
    sync_batch_label: "Sync batch grootte",
    sync_batch_placeholder: "20",
    sync_batch_hint:
      "Kies een kleinere batch om API-limieten te vermijden (bijv. 15-25).",
    cooldown_label: "Cooldown seconden",
    cooldown_placeholder: "2",
    cooldown_hint: "Pauze tussen API-verzoeken om fouten te beperken.",
    cooldown_prefix: "Cooldown",
    api_test_ok: "API-verbinding geslaagd.",
    api_test_fail: "API-verbinding mislukt.",
    api_test_word_ok: "Woordtest ok: {word}",
    api_test_word_fail: "Woordtest mislukt.",
    api_test_start: "API-verbinding testen...",
    custom_shelf_start: "Custom shelf maken...",
    api_test_all_start: "Bezig met alle modellen testen...",
    api_test_all_done: "Aanbevolen modellen: {models}",
    api_test_all_none: "Geen model geslaagd.",
    sync_all_none: "Alle woorden zijn compleet.",
    sync_in_progress: "Bezig met {count} woorden in één verzoek...",
    sync_progress: "Bezig met {done} van {total} woorden...",
    sync_partial_done: "Sync tot nu toe: {done} van {total} woorden.",
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
  ioFile: document.getElementById("ioFile"),
  ioMode: document.getElementById("ioMode"),
  ioImport: document.getElementById("ioImport"),
  ioExport: document.getElementById("ioExport"),
  syncWords: document.getElementById("syncWords"),
  syncStatus: document.getElementById("syncStatus"),
  wordList: document.getElementById("wordList"),
  copyShelfWords: document.getElementById("copyShelfWords"),
  copyShelfSelect: document.getElementById("copyShelfSelect"),
  copyMode: document.getElementById("copyMode"),
  practiceEmpty: document.getElementById("practiceEmpty"),
  practiceSelector: document.getElementById("practiceSelector"),
  practiceCard: document.getElementById("practiceCard"),
  g5Boxes: document.getElementById("g5Boxes"),
  g5BoxesReset: document.querySelector(".g5-box.reset"),
  g5Counts: document.getElementById("g5Counts"),
  practiceFlip: document.getElementById("practiceFlip"),
  practiceFrontCard: document.getElementById("practiceFrontCard"),
  practicePronunciation: document.getElementById("practicePronunciation"),
  practiceWord: document.getElementById("practiceWord"),
  practiceDetails: document.getElementById("practiceDetails"),
  practiceProgressFill: document.getElementById("practiceProgressFill"),
  markKnown: document.getElementById("markKnown"),
  markUnknown: document.getElementById("markUnknown"),
  practiceActions: document.querySelector("#practiceCard .practice-actions"),
  practiceProgress: document.getElementById("practiceProgress"),
  practiceLanguage: document.getElementById("practiceLanguage"),
  practiceShelf: document.getElementById("practiceShelf"),
  startPractice: document.getElementById("startPractice"),
  openPracticeSettings: document.getElementById("openPracticeSettings"),
  practiceSheet: document.getElementById("practiceSheet"),
  toast: document.getElementById("toast"),
  apiKey: document.getElementById("apiKey"),
  modelName: document.getElementById("modelName"),
  syncBatchSize: document.getElementById("syncBatchSize"),
  cooldownSeconds: document.getElementById("cooldownSeconds"),
  modelStatus: document.getElementById("modelStatus"),
  apiTest: document.getElementById("apiTest"),
  apiTestStatus: document.getElementById("apiTestStatus"),
  apiTestResult: document.getElementById("apiTestResult"),
  apiTestAll: document.getElementById("apiTestAll"),
  apiTestAllStatus: document.getElementById("apiTestAllStatus"),
  languageSelect: document.getElementById("languageSelect"),
  saveSettings: document.getElementById("saveSettings"),
  forceUpdate: document.getElementById("forceUpdate"),
  updateStatus: document.getElementById("updateStatus"),
  shelfSheet: document.getElementById("shelfSheet"),
  shelfSheetSelect: document.getElementById("shelfSheetSelect"),
  shelfSheetApply: document.getElementById("shelfSheetApply"),
  aboutTrigger: document.getElementById("aboutTrigger"),
  aboutSheet: document.getElementById("aboutSheet"),
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
  shelfCards: document.getElementById("shelfCards"),
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
  if (elements.syncBatchSize) {
    elements.syncBatchSize.value = String(state.settings.syncBatchSize || 20);
  }
  if (elements.cooldownSeconds) {
    elements.cooldownSeconds.value = String(state.settings.cooldownSeconds ?? 2);
  }
  if (elements.languageSelect) {
    elements.languageSelect.value = state.settings.language || "fa";
  }
  if (elements.customShelfLanguage) {
    elements.customShelfLanguage.value = state.settings.language || "fa";
  }
  if (elements.apiKey.value) {
    loadModelsList();
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
  renderShelfCards();
  updateCopyModeUi();
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

  if (elements.ioImport) {
    elements.ioImport.addEventListener("click", () => {
      if (!elements.ioFile.files?.length) {
        setStatus(t("json_select_file"));
        return;
      }
      const file = elements.ioFile.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const data = JSON.parse(reader.result);
          const mode = getIoMode();
          await handleImportByMode(mode, data);
        } catch (error) {
          setStatus(t("json_invalid"));
        }
      };
      reader.readAsText(file);
    });
  }

  if (elements.ioExport) {
    elements.ioExport.addEventListener("click", () => {
      const mode = getIoMode();
      handleExportByMode(mode);
    });
  }

  if (elements.copyMode) {
    elements.copyMode.addEventListener("change", () => {
      updateCopyModeUi();
    });
  }

  if (elements.copyShelfWords) {
    elements.copyShelfWords.addEventListener("click", () => {
      const mode = elements.copyMode?.value || "all";
      let words = [];
      if (mode === "shelf") {
        const shelfId = elements.copyShelfSelect?.value;
        const shelf = state.settings.shelves.find((item) => item.id === shelfId);
        if (!shelf) {
          setStatus("شلف پیدا نشد.");
          return;
        }
        words = state.words
          .filter((word) => word.shelfId === shelf.id)
          .map((word) => word.word);
      } else {
        words = state.words.map((word) => word.word);
      }
      if (!words.length) {
        setStatus("لغتی برای کپی وجود ندارد.");
        return;
      }
      const payload = words.join("\n");
      navigator.clipboard
        .writeText(payload)
        .then(() => {
          setStatus("لغات کپی شد.");
        })
        .catch(() => {
          setStatus("کپی انجام نشد.");
        });
    });
  }

  // export handled in new handler with shelf filter

  elements.syncWords.addEventListener("click", async () => {
    await syncAllWords();
  });

  elements.practiceFlip.addEventListener("click", () => {
    practiceState.showAnswer = !practiceState.showAnswer;
    renderPractice();
  });

  let swipeStart = null;
  let swipeLocked = false;
  elements.practiceFlip.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    swipeStart = { x: touch.clientX, y: touch.clientY };
    swipeLocked = false;
  });
  elements.practiceFlip.addEventListener(
    "touchmove",
    (event) => {
      if (!swipeStart) return;
      const touch = event.touches[0];
      const dx = touch.clientX - swipeStart.x;
      const dy = touch.clientY - swipeStart.y;
      if (!swipeLocked && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        swipeLocked = true;
      }
      if (swipeLocked) {
        event.preventDefault();
      }
    },
    { passive: false }
  );
  elements.practiceFlip.addEventListener("touchend", (event) => {
    if (!swipeStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - swipeStart.x;
    const dy = touch.clientY - swipeStart.y;
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
    if (elements.syncBatchSize) {
      const raw = parseInt(elements.syncBatchSize.value, 10);
      const normalized = Number.isFinite(raw) ? raw : 20;
      state.settings.syncBatchSize = clampNumber(normalized, 5, 50);
      elements.syncBatchSize.value = String(state.settings.syncBatchSize);
    }
    if (elements.cooldownSeconds) {
      const raw = parseInt(elements.cooldownSeconds.value, 10);
      const normalized = Number.isFinite(raw) ? raw : 2;
      state.settings.cooldownSeconds = clampNumber(normalized, 0, 30);
      elements.cooldownSeconds.value = String(state.settings.cooldownSeconds);
    }
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


  if (elements.apiTest) {
    elements.apiTest.addEventListener("click", async () => {
      await testApiConnection();
      await runCooldown(elements.apiTest, getCooldownSeconds());
    });
  }

  if (elements.apiTestAll) {
    elements.apiTestAll.addEventListener("click", async () => {
      await testAllModels();
      await runCooldown(elements.apiTestAll, getCooldownSeconds());
    });
  }

  if (elements.forceUpdate) {
    elements.forceUpdate.addEventListener("click", async () => {
      await forceAppUpdate();
    });
  }

  if (elements.practiceLanguage) {
    elements.practiceLanguage.addEventListener("change", (event) => {
      state.settings.practiceLanguage = event.target.value;
      saveState();
      renderPractice();
    });
  }

  if (elements.practiceShelf) {
    elements.practiceShelf.addEventListener("change", (event) => {
      state.settings.practiceShelfId = event.target.value;
      saveState();
      if (state.settings.practiceStarted) {
        refreshPracticeDeck();
        renderPractice();
      }
    });
  }

  if (elements.startPractice) {
    elements.startPractice.addEventListener("click", () => {
      state.settings.practiceStarted = true;
      saveState();
      refreshPracticeDeck();
      renderPractice();
      togglePracticeSheet(false);
    });
  }

  if (elements.openPracticeSettings) {
    elements.openPracticeSettings.addEventListener("click", () => {
      togglePracticeSheet(true);
    });
  }

  if (elements.practiceSheet) {
    const backdrop = elements.practiceSheet.querySelector(".sheet-backdrop");
    backdrop?.addEventListener("click", () => {
      togglePracticeSheet(false);
    });
  }

  if (elements.shelfSheet) {
    const backdrop = elements.shelfSheet.querySelector(".sheet-backdrop");
    backdrop?.addEventListener("click", () => {
      elements.shelfSheet.classList.add("hidden");
    });
  }

  if (elements.aboutSheet) {
    const backdrop = elements.aboutSheet.querySelector(".sheet-backdrop");
    backdrop?.addEventListener("click", () => {
      elements.aboutSheet.classList.add("hidden");
    });
  }

  if (elements.aboutTrigger) {
    elements.aboutTrigger.addEventListener("click", () => {
      if (!elements.aboutSheet) return;
      elements.aboutSheet.classList.remove("hidden");
    });
  }

  if (elements.shelfSheetApply) {
    elements.shelfSheetApply.addEventListener("click", () => {
      if (!shelfSheetTargetId) return;
      const word = state.words.find((item) => item.id === shelfSheetTargetId);
      if (!word) return;
      word.shelfId = elements.shelfSheetSelect.value;
      word.updatedAt = new Date().toISOString();
      saveState();
      renderWords();
      elements.shelfSheet.classList.add("hidden");
      shelfSheetTargetId = null;
    });
  }

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
    let customOk = true;
    let addedCount = 0;
    try {
      showToast(t("custom_shelf_start"));
      const words = await generateShelfWords(description, level, count, language);
      if (!words.length) {
        setCustomShelfStatus(t("custom_shelf_empty"));
        return;
      }
      addedCount = await addWordsWithCorrection(words, shelf.id);
      await runCooldown(elements.createCustomShelf, getCooldownSeconds());
      setStatus(t("words_added", { count: addedCount }));
      setCustomShelfStatus(
        addedCount > 0
          ? t("custom_shelf_done", { count: addedCount })
          : t("custom_shelf_no_new")
      );
      renderShelfSelect();
      renderShelfList();
      renderWords();
    } catch (error) {
      customOk = false;
      console.error(error);
      setCustomShelfStatus(error.message || t("sync_error"));
      showToast(error.message || t("sync_error"));
    } finally {
      if (customOk && addedCount > 0) {
        showToast(t("custom_shelf_done", { count: addedCount }));
      }
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

function getDefaultShelfName() {
  return t("shelf_default_name");
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
  updateDefaultShelfName();
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

function getPracticeDirClass() {
  const lang = state.settings.practiceLanguage || state.settings.language || "fa";
  return lang === "fa" ? "dir-rtl" : "dir-ltr";
}

function getPracticeMeaning(item) {
  const lang = state.settings.practiceLanguage || state.settings.language || "fa";
  if (lang === "en") {
    return item.meaningsByLang?.en || item.meaningEn || "";
  }
  if (lang === "nl") {
    return item.meaningsByLang?.nl || "";
  }
  return item.meaningsByLang?.fa || item.meaningFa || "";
}

function syncPracticeSelectors() {
  if (elements.practiceLanguage) {
    elements.practiceLanguage.value = state.settings.practiceLanguage || "fa";
  }
  if (elements.practiceShelf) {
    elements.practiceShelf.innerHTML = "";
    state.settings.shelves.forEach((shelf) => {
      const option = document.createElement("option");
      option.value = shelf.id;
      option.textContent = shelf.name;
      elements.practiceShelf.appendChild(option);
    });
    elements.practiceShelf.value = state.settings.practiceShelfId || "default";
  }
}

function ensureShelves() {
  const raw = state.settings.shelves;
  let shelves = Array.isArray(raw) ? raw.filter(Boolean) : [];
  const defaultName = getDefaultShelfName();
  if (!shelves.length) {
    shelves = [
      { id: "default", name: defaultName, description: "", isDefault: true },
    ];
  }
  if (!shelves.some((shelf) => shelf.id === "default")) {
    shelves.unshift({
      id: "default",
      name: defaultName,
      description: "",
      isDefault: true,
    });
  }
  state.settings.shelves = shelves.map((shelf) => ({
    id: shelf.id,
    name:
      shelf.id === "default"
        ? shelf.name && shelf.name !== "Default"
          ? shelf.name
          : defaultName
        : shelf.name || defaultName,
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

function updateDefaultShelfName() {
  const defaultName = getDefaultShelfName();
  const shelf = state.settings.shelves.find((item) => item.id === "default");
  if (shelf && shelf.name !== defaultName) {
    shelf.name = defaultName;
    saveState();
    renderShelfSelect();
    renderShelfList();
    renderShelfCards();
  }
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
  const defaultName = getDefaultShelfName();
  if (!state.settings.shelves.length) {
    state.settings.shelves = [
      { id: "default", name: defaultName, description: "", isDefault: true },
    ];
  }
  if (!state.settings.shelves.some((s) => s.id === "default")) {
    state.settings.shelves.unshift({
      id: "default",
      name: defaultName,
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
  renderCopyShelfOptions();
}

function renderShelfCards() {
  if (!elements.shelfCards) return;
  elements.shelfCards.innerHTML = "";
  const activeShelfId = getActiveShelfId();
  state.settings.shelves.forEach((shelf) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "shelf-card";
    if (shelf.id === activeShelfId) {
      card.classList.add("active");
    }
    const title = document.createElement("div");
    title.className = "shelf-card-title";
    title.textContent = shelf.name;
    const count = state.words.filter(
      (word) => (word.shelfId || "default") === shelf.id
    ).length;
    const meta = document.createElement("div");
    meta.className = "shelf-card-meta";
    meta.textContent = t("shelf_word_count", { count });
    const desc = document.createElement("div");
    desc.className = "shelf-card-desc";
    desc.textContent = shelf.description || "";
    card.appendChild(title);
    card.appendChild(meta);
    if (shelf.description) {
      card.appendChild(desc);
    }
    card.addEventListener("click", () => {
      state.settings.activeShelfId = shelf.id;
      saveState();
      renderWords();
      renderShelfCards();
    });
    elements.shelfCards.appendChild(card);
  });
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
  renderCopyShelfOptions();
}

function renderCopyShelfOptions() {
  if (!elements.copyShelfSelect) return;
  elements.copyShelfSelect.innerHTML = "";
  state.settings.shelves.forEach((shelf) => {
    const option = document.createElement("option");
    option.value = shelf.id;
    option.textContent = shelf.name;
    elements.copyShelfSelect.appendChild(option);
  });
  elements.copyShelfSelect.value = getActiveShelfId();
}

function getShelfSelection(value, allowAll = false) {
  if (allowAll && value === "all") return "all";
  return value || getActiveShelfId();
}

function filterWordsByShelf(shelfId) {
  if (shelfId === "all") return state.words;
  return state.words.filter(
    (word) => (word.shelfId || "default") === shelfId
  );
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getCooldownSeconds() {
  return clampNumber(state.settings.cooldownSeconds ?? 2, 0, 30);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runCooldown(button, seconds, options = {}) {
  if (!button || !Number.isFinite(seconds) || seconds <= 0) return;
  const {
    prefix = t("cooldown_prefix"),
    keepDisabled = false,
    preserveText = false,
    keepClass = false,
    showBadge = true,
  } = options;
  if (button.dataset.cooldownActive === "true") return;
  button.dataset.cooldownActive = "true";
  const originalHtml = button.innerHTML;
  const originalDisabled = button.disabled;
  button.classList.add("cooldown");
  button.disabled = true;
  let remaining = seconds;
  while (remaining > 0) {
    if (showBadge) {
      button.dataset.cooldownLeft = `${remaining}`;
    }
    if (!preserveText) {
      button.textContent = `${prefix} ${remaining}s`;
    }
    await sleep(1000);
    remaining -= 1;
  }
  if (!preserveText) {
    button.innerHTML = originalHtml;
  }
  if (showBadge) {
    delete button.dataset.cooldownLeft;
  }
  if (!keepClass) {
    button.classList.remove("cooldown");
  }
  button.dataset.cooldownActive = "false";
  if (!keepDisabled) {
    button.disabled = originalDisabled;
  }
}

function getIoMode() {
  return elements.ioMode?.value || "cards_with_shelf";
}

function updateCopyModeUi() {
  if (!elements.copyShelfSelect || !elements.copyMode) return;
  const mode = elements.copyMode.value || "all";
  elements.copyShelfSelect.classList.toggle("hidden", mode !== "shelf");
}

function buildWordsWithMeaningsExport() {
  const payload = state.words.map((word) => ({
    word: word.word,
    meaningsByLang: word.meaningsByLang || {},
    meaningFa: word.meaningFa || "",
    meaningEn: word.meaningEn || "",
    pronunciation: word.pronunciation || "",
    example: word.example || "",
    synonyms: word.synonyms || [],
  }));
  return JSON.stringify(payload, null, 2);
}

function buildCardsWithoutShelfExport() {
  const payload = state.words.map((word) => {
    const copy = { ...word };
    delete copy.shelfId;
    delete copy.shelfName;
    return copy;
  });
  return JSON.stringify(payload, null, 2);
}

function buildCardsWithShelvesExport() {
  const shelves = state.settings.shelves.map((shelf) => ({
    name: shelf.name,
    description: shelf.description || "",
  }));
  const cards = state.words.map((word) => {
    const shelf =
      state.settings.shelves.find((s) => s.id === (word.shelfId || "default")) ||
      state.settings.shelves[0];
    return {
      ...word,
      shelfName: shelf?.name || getDefaultShelfName(),
    };
  });
  return JSON.stringify({ shelves, cards }, null, 2);
}

async function handleExportByMode(mode) {
  if (mode === "words_only") {
    const words = state.words.map((word) => word.word);
    downloadFile(JSON.stringify(words, null, 2), "lingopop-words.json", "application/json");
    return;
  }
  if (mode === "words_meanings") {
    downloadFile(buildWordsWithMeaningsExport(), "lingopop-words-meanings.json", "application/json");
    return;
  }
  if (mode === "cards_no_shelf") {
    downloadFile(buildCardsWithoutShelfExport(), "lingopop-cards.json", "application/json");
    return;
  }
  downloadFile(buildCardsWithShelvesExport(), "lingopop-cards-shelves.json", "application/json");
}

async function handleImportByMode(mode, data) {
  if (mode === "words_only") {
    const words = extractWordsFromJson(data);
    const added = await addWordsWithCorrection(words, getActiveShelfId());
    setStatus(t("json_imported", { count: added }));
    return;
  }
  if (mode === "words_meanings") {
    const { added, skipped } = addCardsFromJson(data, getActiveShelfId());
    setStatus(t("cards_imported", { added, skipped }));
    return;
  }
  if (mode === "cards_no_shelf") {
    const { added, skipped } = addCardsFromJson(data, getActiveShelfId());
    setStatus(t("cards_imported", { added, skipped }));
    return;
  }
  const { added, skipped } = await importCardsWithShelves(data);
  setStatus(t("cards_imported", { added, skipped }));
}

function normalizeShelfName(name) {
  return (name || "").trim().toLowerCase();
}

function findShelfByName(name) {
  const target = normalizeShelfName(name);
  if (!target) {
    return state.settings.shelves.find((shelf) => shelf.id === "default");
  }
  return (
    state.settings.shelves.find(
      (shelf) => normalizeShelfName(shelf.name) === target
    ) || null
  );
}

function createShelfSilent({ name, description = "" }) {
  const id = `shelf-${Date.now().toString(36)}-${Math.random()
    .toString(16)
    .slice(2, 6)}`;
  const shelf = { id, name, description, isDefault: false };
  state.settings.shelves.push(shelf);
  return shelf;
}

function getOrCreateShelfByName(name, description = "") {
  const existing = findShelfByName(name);
  if (existing) {
    if (!existing.description && description) {
      existing.description = description;
    }
    return existing;
  }
  if (!name || normalizeShelfName(name) === normalizeShelfName(getDefaultShelfName())) {
    return state.settings.shelves.find((shelf) => shelf.id === "default");
  }
  return createShelfSilent({ name, description });
}

function buildWordsWithShelvesExport() {
  const shelves = state.settings.shelves.map((shelf) => {
    const words = state.words
      .filter((word) => (word.shelfId || "default") === shelf.id)
      .map((word) => word.word);
    return {
      name: shelf.name,
      description: shelf.description || "",
      words,
    };
  });
  return JSON.stringify({ shelves }, null, 2);
}

async function importWordsWithShelves(data) {
  let totalAdded = 0;

  if (data && Array.isArray(data.shelves)) {
    for (const shelf of data.shelves) {
      const name = typeof shelf?.name === "string" ? shelf.name.trim() : "";
      const description =
        typeof shelf?.description === "string" ? shelf.description.trim() : "";
      const words = Array.isArray(shelf?.words) ? shelf.words : [];
      const targetShelf = getOrCreateShelfByName(name, description);
      const added = await addWordsWithCorrection(words, targetShelf.id);
      totalAdded += added;
    }
  } else if (Array.isArray(data)) {
    const grouped = new Map();
    data.forEach((entry) => {
      if (!entry) return;
      let word = "";
      let shelfName = "";
      if (typeof entry === "string") {
        word = entry;
      } else if (typeof entry.word === "string") {
        word = entry.word;
        shelfName =
          entry.shelfName || entry.shelf || entry.shelf_name || entry.shelfId;
      }
      if (!word) return;
      const shelf = getOrCreateShelfByName(
        typeof shelfName === "string" ? shelfName.trim() : ""
      );
      if (!grouped.has(shelf.id)) {
        grouped.set(shelf.id, []);
      }
      grouped.get(shelf.id).push(word);
    });

    for (const [shelfId, words] of grouped.entries()) {
      const added = await addWordsWithCorrection(words, shelfId);
      totalAdded += added;
    }
  } else {
    throw new Error("Invalid format");
  }

  saveState();
  renderShelfSelect();
  renderShelfList();
  renderShelfCards();
  renderWords();
  return totalAdded;
}

async function importCardsWithShelves(data) {
  let cards = [];
  const shelfMap = new Map();

  if (data && Array.isArray(data.shelves)) {
    data.shelves.forEach((shelf) => {
      const name = typeof shelf?.name === "string" ? shelf.name.trim() : "";
      const description =
        typeof shelf?.description === "string" ? shelf.description.trim() : "";
      const created = getOrCreateShelfByName(name, description);
      shelfMap.set(shelf.id || name, created.id);
      shelfMap.set(name, created.id);
    });
  }

  if (data && Array.isArray(data.cards)) {
    cards = data.cards;
  } else if (Array.isArray(data)) {
    cards = data;
  } else {
    throw new Error("Invalid format");
  }

  const normalizedCards = cards.map((card) => {
    const shelfKey =
      card?.shelfId ||
      card?.shelfName ||
      card?.shelf ||
      card?.shelf_name ||
      card?.shelfId;
    const shelfId =
      shelfMap.get(shelfKey) ||
      getOrCreateShelfByName(typeof shelfKey === "string" ? shelfKey : "").id;
    return { ...card, shelfId };
  });

  const result = addCardsFromJson(normalizedCards);
  saveState();
  renderShelfSelect();
  renderShelfList();
  renderShelfCards();
  renderWords();
  return result;
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
  let syncOk = true;
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
    if (state.settings.practiceStarted && practiceState.deck.length) {
      renderPractice();
    } else {
      refreshPracticeDeck();
      renderPractice();
    }
    syncPracticeSelectors();
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

function addCardsFromJson(data, shelfId = getActiveShelfId()) {
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
      shelfId: card.shelfId || shelfId,
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
  renderShelfCards();
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
    pronounceButton.className = "icon-button small-icon";
    pronounceButton.innerHTML = "<i class='fa-solid fa-volume-low'></i>";
    pronounceButton.addEventListener("click", () => {
      speakWord(item.word);
    });

    const syncButton = document.createElement("button");
    syncButton.className = "icon-button small-icon primary";
    syncButton.innerHTML = "<i class='fa-solid fa-rotate'></i>";
    syncButton.addEventListener("click", async () => {
      await syncSingleCard(item);
      await runCooldown(syncButton, getCooldownSeconds(), { preserveText: true });
    });

    const shelfButton = document.createElement("button");
    shelfButton.className = "icon-button small-icon";
    shelfButton.innerHTML = "<i class='fa-solid fa-layer-group'></i>";
    shelfButton.addEventListener("click", () => {
      openShelfSheet(item.id, item.shelfId || "default");
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
    actions.appendChild(syncButton);
    actions.appendChild(shelfButton);
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
  elements.syncWords.classList.add("cooldown");
  showToast(t("sync_progress", { done: 0, total: pending.length }));
  setStatus(t("sync_progress", { done: 0, total: pending.length }));
  let syncOk = true;
  try {
    const batchSize = clampNumber(state.settings.syncBatchSize || 20, 5, 50);
    const cooldownSeconds = getCooldownSeconds();
    let correctionMap = new Map();
    try {
      const correctionBatchSize = clampNumber(batchSize * 2, 10, 60);
      for (let i = 0; i < pending.length; i += correctionBatchSize) {
        const chunk = pending.slice(i, i + correctionBatchSize);
        const corrected = await correctWordsBatch(chunk.map((item) => item.word));
        corrected.forEach((word, index) => {
          correctionMap.set(normalizeWord(chunk[index].word), word?.trim());
        });
      }
    } catch (error) {
      console.error(error);
    }

    let updatedCount = 0;
    let processedCount = 0;
    for (let i = 0; i < pending.length; i += batchSize) {
      const chunk = pending.slice(i, i + batchSize);
      try {
        const batchData = await generateCardBatchData(
          chunk.map((item) => item.word)
        );
        const normalized = new Map(
          batchData.map((entry) => [normalizeWord(entry.word || ""), entry])
        );
        chunk.forEach((item) => {
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
          item.synonyms = Array.isArray(data.synonyms)
            ? data.synonyms
            : item.synonyms;
          const suggested = correctionMap.get(normalizeWord(item.word));
          if (
            suggested &&
            normalizeWord(suggested) !== normalizeWord(item.word)
          ) {
            item.suggestion = suggested;
          } else {
            item.suggestion = "";
          }
          item.synced = isCardComplete(item);
          item.updatedAt = new Date().toISOString();
          updatedCount += 1;
        });
        processedCount += chunk.length;
        saveState();
        renderWords();
        setStatus(
          t("sync_progress", { done: processedCount, total: pending.length })
        );
        if (cooldownSeconds > 0 && i + batchSize < pending.length) {
          await runCooldown(elements.syncWords, cooldownSeconds, {
            keepDisabled: true,
            preserveText: true,
            keepClass: true,
          });
        }
      } catch (error) {
        console.error(error);
        syncOk = false;
        setStatus(
          t("sync_partial_done", {
            done: processedCount,
            total: pending.length,
          })
        );
        showToast(error.message || t("sync_error"));
        break;
      }
    }

    if (syncOk) {
      const missing = pending.length - updatedCount;
      setStatus(
        missing ? t("sync_partial", { missing }) : t("sync_done")
      );
    }
  } catch (error) {
    syncOk = false;
    console.error(error);
    setStatus(error.message || t("sync_error"));
    showToast(error.message || t("sync_error"));
  } finally {
    if (syncOk) {
      showToast(t("sync_done"));
    }
  }
  elements.syncWords.disabled = false;
  elements.syncWords.classList.remove("cooldown");
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

async function syncSingleCard(item) {
  if (!state.settings.apiKey) {
    setStatus(t("api_key_required"));
    return;
  }
  try {
    showToast(t("sync_in_progress", { count: 1 }));
    const data = await generateCardBatchData([item.word]);
    const entry = Array.isArray(data) ? data[0] : null;
    if (entry) {
      const meanings = entry.meanings || entry.meaningsByLang || {};
      item.meaningFa = meanings.fa || entry.meaningFa || item.meaningFa;
      item.meaningEn = meanings.en || entry.meaningEn || item.meaningEn;
      item.meaningsByLang = {
        fa: meanings.fa || item.meaningsByLang?.fa || item.meaningFa || "",
        en: meanings.en || item.meaningsByLang?.en || item.meaningEn || "",
        nl: meanings.nl || item.meaningsByLang?.nl || "",
      };
      item.pronunciation = entry.pronunciation || item.pronunciation;
      item.example = entry.example || item.example;
      item.synonyms = Array.isArray(entry.synonyms) ? entry.synonyms : item.synonyms;
      item.synced = isCardComplete(item);
      item.updatedAt = new Date().toISOString();
      saveState();
      renderWords();
      refreshPracticeDeck();
      renderPractice();
    }
    showToast(t("sync_done"));
  } catch (error) {
    console.error(error);
    showToast(error.message || t("sync_error"));
  }
}

function openShelfSheet(wordId, currentShelfId) {
  if (!elements.shelfSheet || !elements.shelfSheetSelect) return;
  shelfSheetTargetId = wordId;
  elements.shelfSheetSelect.innerHTML = "";
  state.settings.shelves.forEach((shelf) => {
    const option = document.createElement("option");
    option.value = shelf.id;
    option.textContent = shelf.name;
    elements.shelfSheetSelect.appendChild(option);
  });
  elements.shelfSheetSelect.value = currentShelfId || "default";
  elements.shelfSheet.classList.remove("hidden");
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
  const code = status || "API";
  return `خطا در ارتباط با API (${code})`;
}

async function loadModelsList(showMessage = false) {
  const apiKey = elements.apiKey?.value?.trim();
  if (!apiKey || !elements.modelName) return;
  try {
    const current = elements.modelName.value;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(buildApiError("Models", response.status, errorText));
    }
    const data = await response.json();
    const models = (data.models || [])
      .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
      .map((model) => model.name?.replace("models/", ""))
      .filter(Boolean);
    if (!models.length) {
      if (showMessage) setModelStatus("مدلی یافت نشد.");
      return;
    }
    elements.modelName.innerHTML = "";
    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      elements.modelName.appendChild(option);
    });
    if (current && models.includes(current)) {
      elements.modelName.value = current;
    } else if (models.includes("gemini-flash-latest")) {
      elements.modelName.value = "gemini-flash-latest";
    } else {
      elements.modelName.value = models[0];
    }
    state.settings.model = elements.modelName.value;
    saveState();
    if (showMessage) setModelStatus("مدل‌ها به‌روزرسانی شد.");
  } catch (error) {
    console.error(error);
    if (showMessage) setModelStatus(error.message || t("sync_error"));
  }
}

async function testApiConnection() {
  const apiKey = elements.apiKey?.value?.trim();
  if (!apiKey) {
    setApiTestStatus(t("api_key_required"));
    return;
  }
  try {
    showToast(t("api_test_start"));
    setApiTestResult("");
    setApiTestAllStatus("");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(buildApiError("Models", response.status, errorText));
    }
    setApiTestStatus(t("api_test_ok"));
    try {
      const testWord = "example";
      const data = await generateCardBatchData([testWord]);
      if (Array.isArray(data) && data.length) {
        setApiTestResult(t("api_test_word_ok", { word: testWord }));
        showToast(t("api_test_ok"));
      } else {
        setApiTestResult(t("api_test_word_fail"));
      }
    } catch (error) {
      console.error(error);
      setApiTestResult(error.message || t("api_test_word_fail"));
      showToast(error.message || t("api_test_fail"));
    }
  } catch (error) {
    console.error(error);
    setApiTestStatus(error.message || t("api_test_fail"));
    showToast(error.message || t("api_test_fail"));
  }
}

async function testAllModels() {
  const apiKey = elements.apiKey?.value?.trim();
  if (!apiKey) {
    setApiTestAllStatus(t("api_key_required"));
    return;
  }
  if (!elements.modelName) return;

  const models = Array.from(elements.modelName.options).map((opt) => opt.value);
  if (!models.length) {
    setApiTestAllStatus(t("api_test_all_none"));
    return;
  }

  setApiTestAllStatus(t("api_test_all_start"));
  const previousModel = state.settings.model;
  const passing = [];
  for (const model of models) {
    try {
      state.settings.model = model;
      elements.modelName.value = model;
      const meaning = await generateCardBatchData(["example"]);
      const spelling = await correctWordsBatch(["example"]);
      if (Array.isArray(meaning) && meaning.length && Array.isArray(spelling)) {
        passing.push(model);
      }
    } catch (error) {
      console.error(error);
    }
  }

  state.settings.model = previousModel;
  elements.modelName.value = previousModel;

  if (passing.length) {
    setApiTestAllStatus(t("api_test_all_done", { models: passing.join(", ") }));
  } else {
    setApiTestAllStatus(t("api_test_all_none"));
  }
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
  const shelfId = state.settings.practiceShelfId || "default";
  const shelfWords = state.words.filter(
    (word) => (word.shelfId || "default") === shelfId
  );
  if (activeBox) {
    const deck = shuffle(shelfWords.filter((word) => word.box === activeBox));
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
    if (shelfWords.some((word) => word.box === box)) {
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
  const deck = shuffle(shelfWords.filter((word) => word.box === selectedBox));
  practiceState = {
    deck,
    currentIndex: 0,
    showAnswer: false,
    activeBox: null,
    currentBoxIndex: nextIndex,
  };
}

function renderPractice() {
  if (elements.practiceSheet && !state.settings.practiceStarted) {
    togglePracticeSheet(true);
  }
  if (elements.practiceCard) {
    elements.practiceCard.classList.toggle(
      "hidden",
      !state.settings.practiceStarted
    );
  }
  if (!practiceState.deck.length) {
    if (!state.words.length) {
      elements.practiceEmpty.classList.remove("hidden");
      if (elements.practiceCard) {
        elements.practiceCard.classList.add("hidden");
      }
      return;
    }
    elements.practiceEmpty.classList.add("hidden");
    if (elements.practiceCard) {
      elements.practiceCard.classList.remove("hidden");
    }
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
  if (elements.practicePronunciation) {
    elements.practicePronunciation.textContent = current.pronunciation || "—";
  }
  applyPracticeCardTheme();

  const targetMeaning = getPracticeMeaning(current) || "—";
  const englishMeaning = current.meaningsByLang?.en || current.meaningEn || "—";
  const details = `
    <header class="word-header">
      <h3 class="word-title dir-ltr">${current.word}</h3>
    </header>
    <div class="word-meta">
      <div class="word-meta-item">
        <span class="meta-label">${t("meaning_target")}</span>
        <span class="meta-value ${getPracticeDirClass()}">${targetMeaning}</span>
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
    <div class="word-actions">
      <button class="practice-pronounce">${t("play_pronunciation")}</button>
    </div>
  `;

  elements.practiceDetails.innerHTML = details;
  const pronounceButton = elements.practiceDetails.querySelector(".practice-pronounce");
  pronounceButton?.addEventListener("click", () => {
    speakWord(current.word);
  });
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
  const shelfId = state.settings.practiceShelfId || "default";
  const counts = [1, 2, 3, 4, 5].map(
    (box) =>
      state.words.filter(
        (word) => (word.shelfId || "default") === shelfId && word.box === box
      ).length
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

function setModelStatus(message) {
  if (!elements.modelStatus) return;
  elements.modelStatus.textContent = message;
  window.clearTimeout(setModelStatus.timeoutId);
  setModelStatus.timeoutId = window.setTimeout(() => {
    elements.modelStatus.textContent = "";
  }, 6000);
}

function setApiTestStatus(message) {
  if (!elements.apiTestStatus) return;
  elements.apiTestStatus.textContent = message;
  window.clearTimeout(setApiTestStatus.timeoutId);
  setApiTestStatus.timeoutId = window.setTimeout(() => {
    elements.apiTestStatus.textContent = "";
  }, 6000);
}

function setApiTestResult(message) {
  if (!elements.apiTestResult) return;
  elements.apiTestResult.textContent = message;
  window.clearTimeout(setApiTestResult.timeoutId);
  setApiTestResult.timeoutId = window.setTimeout(() => {
    elements.apiTestResult.textContent = "";
  }, 8000);
}

function setApiTestAllStatus(message) {
  if (!elements.apiTestAllStatus) return;
  elements.apiTestAllStatus.textContent = message;
  window.clearTimeout(setApiTestAllStatus.timeoutId);
  setApiTestAllStatus.timeoutId = window.setTimeout(() => {
    elements.apiTestAllStatus.textContent = "";
  }, 12000);
}

function setUpdateStatus(message) {
  if (!elements.updateStatus) return;
  elements.updateStatus.textContent = message;
  window.clearTimeout(setUpdateStatus.timeoutId);
  setUpdateStatus.timeoutId = window.setTimeout(() => {
    elements.updateStatus.textContent = "";
  }, 6000);
}

function togglePracticeSheet(show) {
  if (!elements.practiceSheet) return;
  elements.practiceSheet.classList.toggle("hidden", !show);
}

function showToast(message) {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 3000);
}

async function forceAppUpdate() {
  try {
    setUpdateStatus("در حال بروزرسانی...");
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch (error) {
    console.error(error);
  } finally {
    const url = new URL(window.location.href);
    url.searchParams.set("update", Date.now().toString());
    window.location.replace(url.toString());
  }
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