import CryptoES from 'crypto-es';
    
   export default class Crypto {
       Reverse(value: string): string {
        let reverse = value.split("").reverse().join("")
        return reverse
    }

    Encrypt(value: string, key_: string, method: string, reverseKey: boolean, reverse:boolean): string {
        let encrypted: string = value;
        let key = key_;
        if(reverseKey){
            key = this.Reverse(key_);
        }
        if (method == "A") {
            encrypted = CryptoES.AES.encrypt(value, key).toString()
        } else if (method == "B") {
            encrypted = CryptoES.TripleDES.encrypt(value, key).toString()
        } else if (method == "R") {
            encrypted = CryptoES.Rabbit.encrypt(value, key).toString()
        }
        if(reverse){
            return this.Reverse(encrypted)
        }else{
            return encrypted
        }
    }

    Decrypt(value: string, key_: string, method: string, reverseKey: boolean, reverse:boolean): string {
        let decrypted: string = value;
        let key = key_;
        if(reverseKey){
            key = this.Reverse(key_);
        }
        if (method == "A") {
            decrypted = CryptoES.AES.decrypt(value, key).toString(CryptoES.enc.Utf8)
        } else if (method == "B") {
            decrypted = CryptoES.TripleDES.decrypt(value, key).toString(CryptoES.enc.Utf8)
        } else if (method == "R") {
            decrypted = CryptoES.Rabbit.decrypt(value, key).toString(CryptoES.enc.Utf8)
        }
        if(reverse){
            return this.Reverse(decrypted)
        }else{
            return decrypted
        }
    }
}