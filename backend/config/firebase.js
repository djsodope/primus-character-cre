const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with service account JSON
const serviceAccount = {
  type: "service_account",
  project_id: "projectap-54446",
  private_key_id: "bae5195e6653549debf61ff273274c998b2ce97b",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCpgMB5to/L4srE\nnd2nDMosvXFjo9CP0d0IuW0vJ1AIA9vD0rxeNUF1+SAERg2OhBV1SRVjIb9mJTxX\n8kfQs6W+IuO6ol6ffG52TobG+xSpsApwBuq3W3tQ45Vw5SrQ9+4nVTTo7XJ4cz3y\nrhVPyrXkXn+qQKn9V+xGa1yF+HshMm8AvCUCuqtxKs7d5/UUikZKNrBCEsC9Zlck\nV5JfgK6kS4z9qSFszI3MdM5iv8QtHwOtYAh7v2N8gP9WOfrlXBoO5L7JQ15r6kPf\nOmCYTmY2MWE0f9k/4oBF38OnsQkjbkfQ6m6d9w5u406pZDdR6k9YoCHYjoChiKlW\nZFIjcbJHAgMBAAECggEACTyxFduYfysg6JFqQWeyBitAvaKNoBU+C53HQqrpANNC\nVlaVS1SNoz5Pu8vjSXadAoat1j+zyQ1aMw2gNrW1UjpC9ao1/aXhgyveWRHYoogA\n2Zx6cO0f4urs+10DhDQD/pD1Xtn3/Dn3EJn/W/zQIPosCVJfP14ir5JmAA6S0sIb\nQo9kl0Rpv4QySlMJEF4rFFAs9tOdfob31PIBvs36nANddy75Jw7yI5+AYmRRU4F4\nb2ps4gJz/TRFYahhXmJvtdf/PPYkusnhDr6oVc3acoaNexehIZtFXYwuBKym8BtM\nGz50VNR7TST2GTG27VabbkNs8LoE9hlQXGFidNohYQKBgQDkd8S4Tt5QAty4DPNz\nQJ4wW1quY32qct/aYwvXzbH3M6bI2QJQqCOtcmsDRx1R04XBd/XtDNszgevyamxr\n+IBZBaUceBT1qEupq4LVSeWEImEAtETirHQr2D4d4ny9DAmybj5lA5mDb8BQHpDD\nbv0sGvCGy5TGtyoPTZwB3EgBcQKBgQC97eqXUhLPCAeyli2l2IhrOq2gaKjdFJzr\n1TnzVFmYGcL/ItQDaV9d3KP3x63fNlS2k6rWHp4uK+1PVV1IOeFYom7fgK9+n5On\ng3wp7Jno8H/xpVYpWyIzNK2+p1RbnYlZEGQuYtnXj7g85oJ+ZUoPHcBCtN49Udz8\n4OxExr4TNwKBgQCxqkGcYhiXd+JUbh3TfmiFikUWX+AVcIeLuII5K4g9iDkm7zrR\npi84bkWxote2Dhtxu+vOj7TWdS4asY/m1rRYhf9ECE2kS1+rbeisHG8TNfjhJ056\nR0l/3wVPEBWYnYfc7cYvn4D9qSWQKHTCxcizR6/L4vyrGzzl8aBkAf0swQKBgQCB\nRHXfSfgNOrzqerZU41xuBwD3ZWRRHF91T6niiG12TUpflhfQvp4u5yYeVaRsgLEF\nltm2ZB5q9HDPBx23M9XBGsT1j8NiHkBDygTvD97tIQsjr9FF0oYjbd43HfIXbNB3\ncuWMgLEduu69XHJCjrPqN+iMPkfoWlhbMMb+RHpH3wKBgC+eYryD6CR3AbvjAc2j\nIg8WdbcFTjeMAglEksy98jgfGm7N6QUIG3Nk2XQ6Jasp1fCX3ro7ARdFQ+vVpXxu\nSKS36gVM2dH69up8aCf6HjFoJzI9EZSQ4M3pFLkeM31wOfOORmm5HxXOZbwtM+Zz\ngSlHxlpKvdR1eysiNPVa+O6l\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@projectap-54446.iam.gserviceaccount.com",
  client_id: "102309423706394437387",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40projectap-54446.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "projectap-54446",
  });
}

module.exports = admin;