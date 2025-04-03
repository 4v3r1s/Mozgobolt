const nodemailer = require('nodemailer');

// Transporter létrehozása valós SMTP szerverrel
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',  // vagy más SMTP szerver
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'info.vandorboltwebaruhaz@gmail.com', // SMTP felhasználó
    pass: 'wujh ycod kiey bdwd', // SMTP jelszó vagy app jelszó
  },
  // Fejlesztési környezetben kikapcsolhatjuk a tanúsítvány ellenőrzését
  tls: {
    rejectUnauthorized: false // Csak fejlesztési környezetben!
  }
});

// Rendelés visszaigazoló e-mail küldése
exports.sendOrderConfirmation = async (orderData, rendelesAzonosito) => {
  try {
    console.log("E-mail küldés előkészítése:", orderData.vevoAdatok.email);
    
    // Termékek listájának összeállítása
    const termekekHTML = orderData.tetelek.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity} db</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${(item.discountPrice || item.price)} Ft</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${(item.discountPrice || item.price) * item.quantity} Ft</td>
      </tr>
    `).join('');

    // E-mail tartalom
    const mailOptions = {
      from: '"MozgoShop" <info.vandorboltwebaruhaz@gmail.com>',
      to: orderData.vevoAdatok.email,
      subject: `Rendelés visszaigazolása - ${rendelesAzonosito}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #c81e1e; color: white; padding: 20px; text-align: center;">
            <h1>Köszönjük a rendelését!</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
            <p>Tisztelt ${orderData.vevoAdatok.lastName} ${orderData.vevoAdatok.firstName}!</p>
            
            <p>Rendelését sikeresen rögzítettük. Az alábbiakban találja a rendelés részleteit:</p>
            
            <div style="background-color: #fff; padding: 15px; border: 1px solid #ddd; margin: 15px 0;">
              <p><strong>Rendelési azonosító:</strong> ${rendelesAzonosito}</p>
              <p><strong>Rendelés dátuma:</strong> ${new Date().toLocaleDateString('hu-HU')}</p>
              
              <h3>Szállítási adatok:</h3>
              <p>
                ${orderData.vevoAdatok.lastName} ${orderData.vevoAdatok.firstName}<br>
                ${orderData.szallitasiAdatok.zipCode} ${orderData.szallitasiAdatok.city}<br>
                ${orderData.szallitasiAdatok.address}<br>
                Tel: ${orderData.vevoAdatok.phone}
              </p>
              
              <h3>Fizetési mód:</h3>
              <p>${orderData.fizetesiMod === 'cash' ? 'Készpénzes fizetés átvételkor' : 'Bankkártyás fizetés'}</p>
              
              <h3>Rendelt termékek:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px; text-align: left;">Termék</th>
                    <th style="padding: 8px; text-align: left;">Mennyiség</th>
                    <th style="padding: 8px; text-align: left;">Egységár</th>
                    <th style="padding: 8px; text-align: left;">Összesen</th>
                  </tr>
                </thead>
                <tbody>
                  ${termekekHTML}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding: 8px; text-align: right;"><strong>Részösszeg:</strong></td>
                    <td style="padding: 8px;">${orderData.osszegek.subtotal} Ft</td>
                  </tr>
                  <tr>
                    <td colspan="3" style="padding: 8px; text-align: right;"><strong>Szállítási díj:</strong></td>
                    <td style="padding: 8px;">${orderData.osszegek.shipping} Ft</td>
                  </tr>
                  ${orderData.osszegek.discount > 0 ? `
                  <tr>
                    <td colspan="3" style="padding: 8px; text-align: right;"><strong>Kedvezmény:</strong></td>
                    <td style="padding: 8px;">-${orderData.osszegek.subtotal * orderData.osszegek.discount / 100} Ft</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td colspan="3" style="padding: 8px; text-align: right;"><strong>Végösszeg:</strong></td>
                    <td style="padding: 8px; font-weight: bold;">${orderData.osszegek.total} Ft</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <p>Köszönjük, hogy a MozgoShop-ot választotta!</p>
            
            <p>Üdvözlettel,<br>MozgoShop Csapata</p>
          </div>
          
          <div style="padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p>Ez egy automatikus üzenet, kérjük, ne válaszoljon rá.</p>
            <p>© 2023 MozgoShop. Minden jog fenntartva.</p>
          </div>
        </div>
      `
    };

    // E-mail küldése
    console.log("E-mail küldés megkísérlése...");
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail elküldve: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Hiba az e-mail küldésekor:', error);
    // Nem dobjuk tovább a hibát, csak naplózzuk
    return { error: error.message };
  }
};

// Alternatív megoldás: Ethereal Email használata teszteléshez
exports.sendTestEmail = async (to, subject, html) => {
  try {
    // Tesztfiók létrehozása
    const testAccount = await nodemailer.createTestAccount();
    
    // Tesztfiók transporterének létrehozása
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    // E-mail küldése
    const info = await testTransporter.sendMail({
      from: '"MozgoShop Test" <test@mozgoshop.hu>',
      to,
      subject,
      html
    });
    
    console.log('Teszt e-mail elküldve: %s', info.messageId);
    console.log('Előnézet URL: %s', nodemailer.getTestMessageUrl(info));
    
    return {
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Hiba a teszt e-mail küldésekor:', error);
    return { error: error.message };
  }
};
