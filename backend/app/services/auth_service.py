
import bcrypt

BCRYPT_MAX_BYTES = 72  # limite dure de l'algorithme bcrypt


def hash_password(mot_de_passe: str) -> str:
    pwd_bytes = mot_de_passe.encode("utf-8")[:BCRYPT_MAX_BYTES]
    return bcrypt.hashpw(pwd_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(mot_de_passe: str, hash_stocke: str | None) -> bool:
    if not hash_stocke:
        return False
    try:
        return bcrypt.checkpw(mot_de_passe.encode("utf-8")[:BCRYPT_MAX_BYTES], hash_stocke.encode("utf-8"))
    except ValueError:
        return False