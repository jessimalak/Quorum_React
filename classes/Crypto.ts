import CryptoES from 'crypto-es';
import items from './Data'
    

 const Crypto = {
       Reverse: (value: string): string=> {
        let reverse = value.split("").reverse().join("")
        return reverse
    },
    Encrypt: (value: string, key_: string, method: "A" | "T" | "R" | "B", reverseKey: boolean, id?:number): string=> {
        let encrypted: string = value;
        let key = id ? items[id] : reverseKey ? Crypto.Reverse(key_) : key_;
        if (method == "A") {
            encrypted = CryptoES.AES.encrypt(value, key).toString()
        } else if (method == "T") {
            encrypted = CryptoES.TripleDES.encrypt(value, key).toString()
        } else if (method == "R") {
            encrypted = CryptoES.Rabbit.encrypt(value, key).toString()
        }
        encrypted = encrypted.split('=').reverse().join('=').split('+').reverse().join('+')
            return Crypto.Reverse(encrypted)
    },
    Decrypt: (value: string, key_: string, method: "A" | "T" | "R" | "B ", reverseKey: boolean, id?:number): string=> {
        let value_ = Crypto.Reverse(value)
        value_ = value_.split('+').reverse().join('+').split('=').reverse().join('=')
        let decrypted: string = value_;
        let key = id ? items[id] : reverseKey ? Crypto.Reverse(key_) : key_;
        if (method == "A") {
            decrypted = CryptoES.AES.decrypt(value_, key).toString(CryptoES.enc.Utf8)
        } else if (method == "T") {
            decrypted = CryptoES.TripleDES.decrypt(value_, key).toString(CryptoES.enc.Utf8)
        } else if (method == "R") {
            decrypted = CryptoES.Rabbit.decrypt(value_, key).toString(CryptoES.enc.Utf8)
        }
            return decrypted
        
    }
}  
 export default Crypto