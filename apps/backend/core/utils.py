from colorama import init as colorama_init, Fore, Style

colorama_init(autoreset=True)

class Logger:
    """Handles styled console logging."""
    PREFIX_ERROR = f"{Fore.RED}❌ Error:{Style.RESET_ALL}"
    PREFIX_SUCCESS = f"{Fore.GREEN}✅ Success:{Style.RESET_ALL}"
    PREFIX_WARNING = f"{Fore.YELLOW}⚠️ Warning:{Style.RESET_ALL}"
    PREFIX_INFO = f"{Fore.BLUE}ℹ️ Info:{Style.RESET_ALL}"
    PREFIX_STEP = f"{Fore.CYAN}➔ Step:{Style.RESET_ALL}"
    PREFIX_SUB_STEP = f"{Fore.MAGENTA}↳ Sub-step:{Style.RESET_ALL}"

    @staticmethod
    def error(message: str):
        print(f"{Logger.PREFIX_ERROR} {message}")

    @staticmethod
    def success(message: str):
        print(f"{Logger.PREFIX_SUCCESS} {message}")

    @staticmethod
    def warning(message: str):
        print(f"{Logger.PREFIX_WARNING} {message}")

    @staticmethod
    def info(message: str):
        print(f"{Logger.PREFIX_INFO} {message}")
    
    @staticmethod
    def step(message: str):
        print(f"\n{Logger.PREFIX_STEP} {Fore.CYAN}{Style.BRIGHT}{message}{Style.RESET_ALL}")

    @staticmethod
    def sub_step(message: str):
        print(f"  {Logger.PREFIX_SUB_STEP} {message}")