// build-script.js - Robot do łączenia plików
const fs = require('fs-extra');
const path = require('path');

console.log('🤖 Rozpoczynam budowanie RETRO_CSSA...');

// Funkcja do odczytania pliku
function readFileIfExists(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        }
        console.log(`⚠️  Plik ${filePath} nie istnieje`);
        return '';
    } catch (error) {
        console.log(`❌ Błąd odczytu ${filePath}:`, error.message);
        return '';
    }
}

// Zbierz wszystkie pliki CSS
console.log('📎 Łączę pliki CSS...');
const cssFiles = [
    'src/styles/styles.css',
    'styles/styles.css',  // fallback
];

let combinedCSS = '';
cssFiles.forEach(file => {
    const content = readFileIfExists(file);
    if (content) {
        combinedCSS += `\n/* === ${file} === */\n${content}`;
        console.log(`✅ Dodano ${file}`);
    }
});

// Zbierz wszystkie pliki JavaScript
console.log('🔧 Łączę pliki JavaScript...');
const jsFiles = [
    'src/app.js',
    'src/api.js', 
    'src/auth.js',
    'src/components/RetroBoard.js',
    'src/components/PlanningPoker.js',
    'src/components/UserList.js',
    'src/components/RoleBasedView.js',
    'src/components/TaskDetails.js',
    'src/components/AssignmentModal.js',
    'src/components/AccountMatcher.js'
];

let combinedJS = '';
jsFiles.forEach(file => {
    const content = readFileIfExists(file);
    if (content) {
        // Usuń import/export statements (bo łączymy wszystko)
        const cleanContent = content
            .replace(/import.*from.*['""];?\s*/g, '')
            .replace(/export\s+default\s+.*;?\s*/g, '')
            .replace(/export\s+{[^}]*}.*;?\s*/g, '');
        
        combinedJS += `\n/* === ${file} === */\n${cleanContent}`;
        console.log(`✅ Dodano ${file}`);
    }
});

// Wczytaj szablon HTML
console.log('🏗️  Buduję index.html...');
let htmlTemplate = readFileIfExists('public/index.html');

// Jeśli nie ma szablonu, użyj domyślnego
if (!htmlTemplate) {
    console.log('📄 Używam domyślnego szablonu HTML');
    htmlTemplate = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RETRO_CSSA</title>
    <style>
        /* STYLES_PLACEHOLDER */
    </style>
</head>
<body>
    <div id="app">
        <!-- Zawartość zostanie załadowana przez JavaScript -->
    </div>
    <script>
        /* JAVASCRIPT_PLACEHOLDER */
    </script>
</body>
</html>`;
}

// Zastąp placeholdery rzeczywistym kodem
const finalHTML = htmlTemplate
    .replace('/* STYLES_PLACEHOLDER */', combinedCSS)
    .replace('/* JAVASCRIPT_PLACEHOLDER */', combinedJS);

// Zapisz wynikowy plik
fs.writeFileSync('index.html', finalHTML);
console.log('🎉 Build zakończony! Utworzono index.html');

// Pokaż statystyki
console.log(`📊 Statystyki:`);
console.log(`   CSS: ${combinedCSS.length} znaków`);
console.log(`   JS: ${combinedJS.length} znaków`);
console.log(`   HTML: ${finalHTML.length} znaków`);
