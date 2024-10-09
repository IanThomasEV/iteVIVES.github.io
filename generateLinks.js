const fs = require('fs');
const path = require('path');

// Functie om de subfolders te lezen en een HTML-bestand te genereren
function generateIndex(mainFolder) {
    fs.readdir(mainFolder, (err, files) => {
        if (err) {
            console.error('Could not list the directory.', err);
            process.exit(1);
        }

        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Opdrachten</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f0f0f0;
                        color: #333;
                    }
                    header {
                        background-color: #e00020;
                        color: white;
                        padding: 10px 20px;
                        text-align: center;
                    }
                    ul {
                        list-style-type: none;
                        padding: 0;
                    }
                    li {
                        margin: 10px 0;
                    }
                    a {
                        background-color: #e00020;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    a:hover {
                        background-color: #d0001a;
                    }
                </style>
            </head>
            <body>
                <header>
                    <h1>Opdrachten</h1>
                    <p>Ian-Thomas Everaerts - 1Tib - R-1033897</p>
                </header>
                <ul>
        `;

        let pendingFiles = files.length;

        files.forEach((file) => {
            const filePath = path.join(mainFolder, file);

            fs.stat(filePath, (error, stat) => {
                if (error) {
                    console.error('Error stating file.', error);
                    return;
                }

                if (stat.isDirectory()) {
                    const indexPath = path.join(filePath, 'index.html');
                    if (fs.existsSync(indexPath)) {
                        fs.readFile(indexPath, 'utf8', (err, data) => {
                            if (err) {
                                console.error('Error reading index.html file.', err);
                                return;
                            }

                            const titleMatch = data.match(/<title>([^<]*)<\/title>/);
                            const title = titleMatch ? titleMatch[1] : file;

                            htmlContent += `<li><a href="${file}/index.html">${title}</a></li>`;

                            pendingFiles--;
                            if (pendingFiles === 0) {
                                htmlContent += '</ul></body></html>';

                                fs.writeFile(path.join(mainFolder, 'index.html'), htmlContent, (err) => {
                                    if (err) throw err;
                                    console.log('Index file has been generated!');
                                });
                            }
                        });
                    } else {
                        pendingFiles--;
                        if (pendingFiles === 0) {
                            htmlContent += '</ul></body></html>';

                            fs.writeFile(path.join(mainFolder, 'index.html'), htmlContent, (err) => {
                                if (err) throw err;
                                console.log('Index file has been generated!');
                            });
                        }
                    }
                } else {
                    pendingFiles--;
                    if (pendingFiles === 0) {
                        htmlContent += '</ul></body></html>';

                        fs.writeFile(path.join(mainFolder, 'index.html'), htmlContent, (err) => {
                            if (err) throw err;
                            console.log('Index file has been generated!');
                        });
                    }
                }
            });
        });
    });
}

// Controleer of het pad als argument is meegegeven
if (process.argv.length < 3) {
    console.error('Geef het pad van de hoofdmap als argument.');
    process.exit(1);
}

const mainFolder = process.argv[2];
generateIndex(mainFolder);
