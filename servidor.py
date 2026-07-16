"""
Servidor local simples para abrir o site sem problemas de navegador.

Como usar:
1. Abra o terminal nesta pasta (onde está este arquivo).
2. Rode:  python3 servidor.py
3. Abra no navegador o endereço que aparecer (geralmente http://localhost:8000)

Isso evita bloqueios que alguns navegadores fazem ao abrir arquivos
HTML diretamente (duplo clique), especialmente com a música de fundo.
"""
import http.server
import socketserver
import webbrowser
import os

PORTA = 8000

os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORTA), Handler) as httpd:
    url = f"http://localhost:{PORTA}"
    print(f"Servindo o site em {url}")
    print("Pressione Ctrl+C para parar.")
    try:
        webbrowser.open(url)
    except Exception:
        pass
    httpd.serve_forever()
