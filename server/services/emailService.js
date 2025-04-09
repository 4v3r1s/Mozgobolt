const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'info.vandorboltwebaruhaz@gmail.com',
    pass: 'dpmo unxt mlca wuxr',
  },
});


exports.sendRegistrationConfirmation = async (userData) => {
  try {
    console.log("Regisztrációs e-mail küldése:", userData.email);
    
    
    const mailOptions = {
      from: '"VándorBolt" <info.vandorboltwebaruhaz@gmail.com>',
      subject: `Sikeres regisztráció a VándorBolt oldalán`,
      to: userData.email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #c81e1e; color: white; padding: 20px; text-align: center;">
            <h1>Köszönjük a regisztrációt!</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
            <p>Kedves ${userData.username}!</p>
            
            <p>Köszönjük, hogy regisztráltál a VándorBolt webáruházban!</p>
            
            <div style="background-color: #fff; padding: 15px; border: 1px solid #ddd; margin: 15px 0;">
              <p>A regisztrációd sikeresen megtörtént. Mostantól bejelentkezhetsz az oldalunkra és élvezheted a regisztrált felhasználók előnyeit:</p>
              
              <ul style="list-style-type: disc; margin-left: 20px;">
                <li>Gyorsabb vásárlási folyamat</li>
                <li>Rendeléseid nyomon követése</li>
                <li>Korábbi rendeléseid megtekintése</li>
                <li>Személyes adataid kezelése</li>
              </ul>
              
              <p style="margin-top: 20px;">Bejelentkezéshez használd az e-mail címedet és a regisztráció során megadott jelszavadat.</p>
            </div>
            
            <p>Köszönjük, hogy a VándorBolt-ot választottad!</p>
            
            <p>Üdvözlettel,<br>VándorBolt Csapata</p>
          </div>
          
          <div style="padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p>Ez egy automatikus üzenet, kérjük, ne válaszoljon rá.</p>
            <p>© 2023 VándorBolt. Minden jog fenntartva.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Regisztrációs e-mail elküldve: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Hiba a regisztrációs e-mail küldésekor:', error);
    
    return { error: error.message };
  }
};



exports.sendOrderConfirmation = async (orderData, rendelesAzonosito) => {
  try {
    console.log("E-mail küldés előkészítése:", orderData.vevoAdatok.email);
    
    const termekekHTML = orderData.tetelek.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity} db</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${(item.discountPrice || item.price)} Ft</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${(item.discountPrice || item.price) * item.quantity} Ft</td>
      </tr>
    `).join('');

   
    const mailOptions = {
      from: '"VándorBolt" <info.vandorboltwebaruhaz@gmail.com>',
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
            
            <p>Köszönjük, hogy a VándorBolt-ot választotta!</p>
            
            <p>Üdvözlettel,<br>VándorBolt Csapata</p>
          </div>
          
          <div style="padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p>Ez egy automatikus üzenet, kérjük, ne válaszoljon rá.</p>
            <p>© 2023 VándorBolt. Minden jog fenntartva.</p>
          </div>
        </div>
      `
    };

    
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail elküldve: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Hiba az e-mail küldésekor:', error);
    
    return { error: error.message };
  }
};


exports.sendOrderCancellationEmail = async (rendelesData) => {
  try {
    console.log("Rendelés törlés e-mail küldése:", rendelesData.vevoEmail);
    
   
    const mailOptions = {
      from: '"VándorBolt" <info.vandorboltwebaruhaz@gmail.com>',
      to: rendelesData.vevoEmail,
      subject: `Rendelés törlése - ${rendelesData.rendelesAzonosito}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #c81e1e; color: white; padding: 20px; text-align: center;">
            <h1>Rendelés törlése</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
            <p>Tisztelt ${rendelesData.vevoNev}!</p>
            
            <p>Értesítjük, hogy az alábbi rendelését sikeresen törölte:</p>
            
            <div style="background-color: #fff; padding: 15px; border: 1px solid #ddd; margin: 15px 0;">
              <p><strong>Rendelési azonosító:</strong> ${rendelesData.rendelesAzonosito}</p>
              <p><strong>Rendelés dátuma:</strong> ${new Date(rendelesData.rendelesIdeje).toLocaleDateString('hu-HU')}</p>
              <p><strong>Végösszeg:</strong> ${rendelesData.vegosszeg} Ft</p>
              
              <h3>Szállítási adatok:</h3>
              <p>
                ${rendelesData.vevoNev}<br>
                ${rendelesData.szallitasiIrsz} ${rendelesData.szallitasiVaros}<br>
                ${rendelesData.szallitasiCim}<br>
                Tel: ${rendelesData.vevoTelefon}
              </p>
            </div>
            
            <p>Amennyiben nem Ön törölte a rendelést, vagy bármilyen kérdése van, kérjük, vegye fel velünk a kapcsolatot.</p>
            
            <p>Köszönjük, hogy a VándorBolt-ot választotta!</p>
            
            <p>Üdvözlettel,<br>VándorBolt Csapata</p>
          </div>
          
          <div style="padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p>Ez egy automatikus üzenet, kérjük, ne válaszoljon rá.</p>
            <p>© 2023 VándorBolt. Minden jog fenntartva.</p>
          </div>
        </div>
      `
    };

    
    const info = await transporter.sendMail(mailOptions);
    console.log('Rendelés törlés e-mail elküldve: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Hiba a rendelés törlés e-mail küldésekor:', error);
    
    return { error: error.message };
  }
};


exports.sendContactFormEmail = async (contactData) => {
  try {
    console.log("Kapcsolati űrlap e-mail küldése:", contactData.email);
    

    const mailOptions = {
      from: '"VándorBolt" <info.vandorboltwebaruhaz@gmail.com>',
      to: 'info.vandorboltwebaruhaz@gmail.com', 
      replyTo: contactData.email, 
      subject: `Kapcsolati űrlap: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #c81e1e; color: white; padding: 20px; text-align: center;">
            <h1>Új üzenet a kapcsolati űrlapról</h1>
          </div>
                    <div style="background-color: #c81e1e; color: white; padding: 20px; text-align: center;">
            <h1>Új üzenet a kapcsolati űrlapról</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-top: 0;">Kapcsolatfelvételi kérelem</h2>
            
            <div style="background-color: #fff; padding: 15px; border: 1px solid #ddd; margin: 15px 0;">
              <p><strong>Név:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> ${contactData.email}</p>
              <p><strong>Telefonszám:</strong> ${contactData.phone || 'Nincs megadva'}</p>
              <p><strong>Tárgy:</strong> ${contactData.subject}</p>
              <p><strong>Üzenet:</strong></p>
              <p style="white-space: pre-line; background-color: #f5f5f5; padding: 10px; border-left: 4px solid #c81e1e;">${contactData.message}</p>
            </div>
            
            <p>Ez az üzenet a VándorBolt weboldal kapcsolati űrlapján keresztül érkezett.</p>
          </div>
          
          <div style="padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p>© 2023 VándorBolt. Minden jog fenntartva.</p>
          </div>
        </div>
      `
    };

    const autoReplyOptions = {
      from: '"VándorBolt" <info.vandorboltwebaruhaz@gmail.com>',
      to: contactData.email,
      subject: `Köszönjük megkeresését - VándorBolt`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #c81e1e; color: white; padding: 20px; text-align: center;">
            <h1>Köszönjük megkeresését!</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
            <p>Tisztelt ${contactData.name}!</p>
            
            <p>Köszönjük, hogy felvette velünk a kapcsolatot. Üzenetét megkaptuk, és hamarosan válaszolunk rá.</p>
            
            <div style="background-color: #fff; padding: 15px; border: 1px solid #ddd; margin: 15px 0;">
              <p><strong>Az Ön által küldött üzenet:</strong></p>
              <p><strong>Tárgy:</strong> ${contactData.subject}</p>
              <p style="white-space: pre-line; background-color: #f5f5f5; padding: 10px; border-left: 4px solid #c81e1e;">${contactData.message}</p>
            </div>
            
            <p>Kérjük, ne válaszoljon erre az automatikus üzenetre. Ha további kérdése van, vagy sürgős a megkeresése, hívjon minket a +36 1 234 5678 telefonszámon.</p>
            
            <p>Üdvözlettel,<br>VándorBolt Csapata</p>
          </div>
          
          <div style="padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p>Ez egy automatikus üzenet, kérjük, ne válaszoljon rá.</p>
            <p>© 2023 VándorBolt. Minden jog fenntartva.</p>
          </div>
        </div>
      `
    };

    
    const info = await transporter.sendMail(mailOptions);
    console.log('Kapcsolati űrlap e-mail elküldve: %s', info.messageId);
    
    
    const autoReplyInfo = await transporter.sendMail(autoReplyOptions);
    console.log('Automatikus válasz elküldve: %s', autoReplyInfo.messageId);
    
    return { info, autoReplyInfo };
  } catch (error) {
    console.error('Hiba a kapcsolati űrlap e-mail küldésekor:', error);
  
    return { error: error.message };
  }
};
