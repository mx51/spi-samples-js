async function createHash(algorithm: string, data: string) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hash = await window.crypto.subtle.digest(algorithm, dataBuffer);
  return btoa(String.fromCharCode(...Array.from(new Uint8Array(hash))));
}

async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();

  const algorithm = { name: 'HMAC', hash: 'SHA-256' };

  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), algorithm, false, ['sign', 'verify']);

  // Sign the data with the key
  const signature = await crypto.subtle.sign(algorithm.name, key, encoder.encode(data));

  return btoa(String.fromCharCode(...Array.from(new Uint8Array(signature))));
}

export const signedRequestInit = async (
  keyId: string,
  signingSecret: string,
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH',
  requestBody: unknown
): Promise<RequestInit> => {
  const url = new URL(endpoint);
  const now = Math.floor(Date.now() / 1000);
  const signatureInput = `("@method" "@authority" "@request-target" "content-digest");created=${now};alg="hmac-sha256";keyid="${keyId}"`;
  const contentDigest = await createHash('SHA-256', JSON.stringify(requestBody));

  // Line breaks are required for the signature to be valid
  const dataToEncrypt =
    `"@method": ${method}` +
    '\n' +
    `"@authority": ${url.host}` +
    '\n' +
    `"@request-target": ${url.pathname}` +
    '\n' +
    `"content-digest": sha-256=:${contentDigest}:` +
    '\n' +
    `"@signature-params": ${signatureInput}`;
  const signature = await createSignature(dataToEncrypt, signingSecret);

  const headers = {
    'Content-Type': 'application/json',
    Signature: `sig1=:${signature}:`,
    'Signature-Input': `sig1=${signatureInput}`,
    'Content-Digest': `sha-256=:${contentDigest}:`,
  };

  const requestInit: RequestInit = {
    method,
    headers,
    body: JSON.stringify(requestBody),
  };

  return requestInit;
};
