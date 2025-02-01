function deserializeRegistrationInfo(serializedInfo) {
    const deserialized = { ...serializedInfo };

    // Convert Base64 strings back to Uint8Array
    if (serializedInfo.credentialPublicKey) {
        deserialized.credentialPublicKey = Uint8Array.from(Buffer.from(serializedInfo.credentialPublicKey, "base64"));
    }
    if (serializedInfo.attestationObject) {
        deserialized.attestationObject = Uint8Array.from(Buffer.from(serializedInfo.attestationObject, "base64"));
    }

    return deserialized;
}

function serializeRegistrationInfo(registrationInfo) {
    const serialized = { ...registrationInfo };

    // Convert binary fields to Base64 strings
    if (registrationInfo.credentialPublicKey) {
        serialized.credentialPublicKey = Buffer.from(registrationInfo.credentialPublicKey).toString("base64");
    }
    if (registrationInfo.attestationObject) {
        serialized.attestationObject = Buffer.from(registrationInfo.attestationObject).toString("base64");
    }

    return serialized;
}

module.exports = {
    serializeRegistrationInfo,
    deserializeRegistrationInfo
}
