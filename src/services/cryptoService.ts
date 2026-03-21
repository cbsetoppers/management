import CryptoJS from 'crypto-js';

const SECRET_KEY = 'CBSETOPPERS_V2_SECURE_VAULT_KEY_2026';
const STATIC_IV = CryptoJS.enc.Utf8.parse('CBSETOPPERS_STATIC_IV123'); // 16 bytes

export const decryptString = (encryptedBase64: string | null | undefined): string => {
    if (!encryptedBase64 || typeof encryptedBase64 !== 'string' || !encryptedBase64.endsWith('=')) {
        return encryptedBase64 || '';
    }
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedBase64, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
            iv: STATIC_IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        const result = bytes.toString(CryptoJS.enc.Utf8);
        return result || encryptedBase64; // fallback if empty
    } catch (e) {
        return encryptedBase64;
    }
};

export const encryptString = (plainText: string | null | undefined): string => {
    if (!plainText) return plainText || '';
    const bytes = CryptoJS.AES.encrypt(plainText, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
        iv: STATIC_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return bytes.toString();
};

export const decryptStudent = (student: any) => {
    if (!student) return student;
    return {
        ...student,
        name: decryptString(student.name),
        phone: decryptString(student.phone),
        email: decryptString(student.email),
        dob: decryptString(student.dob),
    };
};

export const encryptMaterial = (material: any) => {
    if (!material) return material;
    const enc = { ...material };
    if (enc.url) enc.url = encryptString(enc.url);
    if (enc.title) enc.title = encryptString(enc.title);
    return enc;
};

export const decryptMaterial = (material: any) => {
    if (!material) return material;
    return {
        ...material,
        url: decryptString(material.url),
        title: decryptString(material.title),
    };
};
