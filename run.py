# run.py
import subprocess
import sys
import time
import os


def main():
    # Пути к папкам
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")

    print("🚀 Запуск Monopoly MVP...")

    # Процесс 1: Бэкенд (FastAPI)
    print("📡 Поднимаем бэкенд (FastAPI на порту 8000)...")
    # Use venv python if available
    venv_python = os.path.join(root_dir, ".venv", "bin", "python")
    python_exec = venv_python if os.path.exists(venv_python) else sys.executable
    backend_process = subprocess.Popen(
        [python_exec, "-m", "uvicorn", "main:app", "--reload"],
        cwd=backend_dir,
    )

    # Даем бэкенду секунду на старт
    time.sleep(1)

    # Процесс 2: Фронтенд (Vite)
    print("🎨 Поднимаем фронтенд (Vite)...")
    # shell=True нужен на Windows для корректного запуска npm команд
    is_windows = sys.platform.startswith('win')
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir,
        shell=is_windows
    )

    try:
        # Держим скрипт запущенным и слушаем вывод
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        # Корректное завершение при Ctrl+C
        print("\n🛑 Остановка серверов...")
        backend_process.terminate()
        frontend_process.terminate()
        backend_process.wait()
        frontend_process.wait()
        print("✅ Серверы остановлены.")


if __name__ == "__main__":
    main()