// ═══════════════════════════════════════════════════════════════
// ENERGY DASHBOARD — Apps Script COMPLETO
// Original + Chat interno + Aprobación DNC por WhatsApp
// ═══════════════════════════════════════════════════════════════

// ── CallMeBot config ─────────────────────────────────────────
var CALLMEBOT_RECIPIENTS = [
  { phone: '573155062006', apikey: '6567404' },
  { phone: '573203976772', apikey: '3822234' }
  // 573024230594 se agrega cuando tenga su apikey
];
var SUPERVISOR_NUMBERS = ['573155062006', '573203976772'];

// ── CallMeBot helper ─────────────────────────────────────────
function sendToNumber(phone, message) {
  var url = 'https://api.callmebot.com/whatsapp.php'
    + '?phone=' + phone
    + '&text='  + encodeURIComponent(message)
    + '&apikey=' + getApiKey(phone);
  var options = { method: 'GET', muteHttpExceptions: true };
  var resp = UrlFetchApp.fetch(url, options);
  Logger.log('CallMeBot ' + phone + ': ' + resp.getResponseCode());
  return resp.getResponseCode();
}

function getApiKey(phone) {
  for (var i = 0; i < CALLMEBOT_RECIPIENTS.length; i++) {
    if (CALLMEBOT_RECIPIENTS[i].phone === phone) return CALLMEBOT_RECIPIENTS[i].apikey;
  }
  return '';
}

function sendWhatsAppNotification(message) {
  if (!message) message = 'Prueba Energy Dashboard';
  for (var i = 0; i < CALLMEBOT_RECIPIENTS.length; i++) {
    sendToNumber(CALLMEBOT_RECIPIENTS[i].phone, message);
    Utilities.sleep(1500);
  }
}

// ── Main dispatcher ──────────────────────────────────────────
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    // ── ORIGINAL ACTIONS ────────────────────────────────────

    if (data.action === 'authenticate') {
      var usersSheet = ss.getSheetByName('USERS');
      if (!usersSheet) return respond({success:false,error:'No users sheet'});
      var rows = usersSheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        var uname  = String(rows[i][1]).trim();
        var upass  = String(rows[i][2]).trim();
        var uname2 = String(rows[i][3]).trim();
        var urole  = String(rows[i][4]).trim();
        var active = String(rows[i][5]).trim().toUpperCase();
        if (uname === data.username && upass === data.password) {
          if (active === 'FALSE') return respond({success:false,reason:'inactive'});
          return respond({success:true,name:uname2,role:urole,id:String(rows[i][0]).trim()});
        }
      }
      return respond({success:false,reason:'invalid'});
    }

    if (data.action === 'check_dnc') {
      var dncSheet = ss.getSheetByName('DNC%20INDRA%20APP');
      if (!dncSheet) dncSheet = ss.getSheetByName('Hoja 1');
      if (!dncSheet) return respond({found:false,error:'No DNC sheet'});
      var phone = String(data.phone||'').replace(/[^0-9]/g,'').slice(0,10);
      if (phone.length < 7) return respond({found:false,error:'Invalid number'});
      var dncData = dncSheet.getDataRange().getValues();
      var found = false;
      for (var r = 0; r < dncData.length; r++) {
        for (var c = 0; c < dncData[r].length; c++) {
          var cell = String(dncData[r][c]||'').replace(/[^0-9]/g,'').slice(0,10);
          if (cell === phone) { found = true; break; }
        }
        if (found) break;
      }
      var agent  = data.agent || 'Agente';
      var state  = data.state || '';
      var status = found ? 'EN DNC - NO LLAMAR' : 'LIBRE - Puede continuar';
      var emoji  = found ? 'ALERTA' : 'OK';
      // Si está LIBRE, agregar instrucción de aprobación al mensaje WA
      var approvalLine = !found
        ? '\nResponde: APROBADO ' + phone + '\n         o RECHAZADO ' + phone
        : '';
      var msg = emoji + ' CONSULTA DNC\n'
        + '---------------\n'
        + 'Numero: ' + phone + '\n'
        + 'Resultado: ' + status + '\n'
        + 'Agente: ' + agent + '\n'
        + 'Estado: ' + state + '\n'
        + 'Hora: ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yy HH:mm') + '\n'
        + 'Energy Dashboard'
        + approvalLine;
      sendWhatsAppNotification(msg);
      return respond({found:found});
    }

    if (data.action === 'send_whatsapp') {
      sendWhatsAppNotification(data.message||'');
      return respond({success:true});
    }

    if (data.action === 'notify_sale') {
      var s = data.sale || {};
      var msg2 = 'VENTA REGISTRADA\n'
        + '---------------\n'
        + 'Agente: ' + (s.agent||'') + '\n'
        + 'REP ID: ' + (s.repId||'') + '\n'
        + '---------------\n'
        + 'Cliente: ' + (s.holder||'') + '\n'
        + 'Tel: ' + (s.phone||'') + '\n'
        + 'Dir: ' + (s.address||'') + ', ' + (s.city||'') + '\n'
        + 'Estado: ' + (s.state||'') + '\n'
        + 'Utilidad: ' + (s.utility||'') + '\n'
        + 'Supplier: ' + (s.supplier||'') + '\n'
        + 'Tarifa: ' + (s.rate||'') + '\n'
        + 'Idioma: ' + (s.language||'') + '\n'
        + '---------------\n'
        + 'Hora: ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yy HH:mm') + '\n'
        + 'Energy Dashboard';
      sendWhatsAppNotification(msg2);
      return respond({success:true});
    }

    if (data.action === 'save_sale') {
      var salesSheet = ss.getSheetByName('VENTAS');
      if (!salesSheet) {
        salesSheet = ss.insertSheet('VENTAS');
        salesSheet.appendRow([
          'Marca temporal','AGENT NAME','REP ID','BTN - Customer Phone Number',
          'Customer Name/Contact Person','COMMODITY',
          'ELECTRIC UTILITY','ELECTRIC ACCOUNT NUMBER',
          'GAS UTILITY','GAS ACCOUNT #',
          'SERVICE ADDRESS','CITY','STATE','ZIP CODE',
          'SUPPLIER','TPV #','TYPE OF CLIENT',
          'Idioma','Autorizado','Estado Venta'
        ]);
        var hr = salesSheet.getRange(1,1,1,20);
        hr.setBackground('#1a1a2e');
        hr.setFontColor('#ffffff');
        hr.setFontWeight('bold');
        salesSheet.setFrozenRows(1);
      }
      var s2 = data.sale || {};
      var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      salesSheet.appendRow([
        dateStr,
        s2.agent      || '',
        s2.repId      || '',
        s2.phone      || '',
        s2.holder     || '',
        s2.commodity  || 'Electric',
        s2.electricUtil || s2.utility || '',
        s2.electricAcc  || '',
        s2.gasUtil    || '',
        s2.gasAcc     || '',
        s2.address    || '',
        s2.city       || '',
        s2.state      || '',
        s2.zip        || '',
        s2.supplier   || '',
        s2.tpvNum     || '',
        s2.typeOfClient || 'Residential',
        s2.language   || '',
        s2.authorized || '',
        'Enviada'
      ]);
      return respond({success:true,row:salesSheet.getLastRow()});
    }

    if (data.action === 'login') {
      var sheet = getOrCreateSheet(ss, 'SESSIONS');
      var now = new Date();
      var TIMEOUT_MS = 16 * 60 * 1000;
      var allData = sheet.getDataRange().getValues();
      for (var i = 1; i < allData.length; i++) {
        var rowUser   = String(allData[i][0]).trim();
        var rowTime   = allData[i][1];
        var rowStatus = String(allData[i][2]).trim();
        if (rowUser === data.username && rowStatus === 'active') {
          var elapsed = now.getTime() - new Date(rowTime).getTime();
          if (elapsed < TIMEOUT_MS) {
            return respond({blocked:true,since:String(rowTime)});
          } else {
            sheet.getRange(i + 1, 3).setValue('inactive');
          }
        }
      }
      sheet.appendRow([data.username, now.toISOString(), 'active', data.token]);
      return respond({blocked:false});
    }

    if (data.action === 'logout') {
      var sheet2 = getOrCreateSheet(ss, 'SESSIONS');
      var rows2 = sheet2.getDataRange().getValues();
      for (var j = 1; j < rows2.length; j++) {
        if (String(rows2[j][0]).trim() === data.username && String(rows2[j][3]).trim() === data.token) {
          sheet2.getRange(j + 1, 3).setValue('inactive');
        }
      }
      return respond({ok:true});
    }

    if (data.action === 'heartbeat') {
      var sheet3 = getOrCreateSheet(ss, 'SESSIONS');
      var rows3 = sheet3.getDataRange().getValues();
      for (var k = 1; k < rows3.length; k++) {
        if (String(rows3[k][0]).trim() === data.username && String(rows3[k][3]).trim() === data.token && String(rows3[k][2]).trim() === 'active') {
          sheet3.getRange(k + 1, 2).setValue(new Date().toISOString());
        }
      }
      return respond({ok:true});
    }

    // ── NUEVAS ACCIONES: CHAT ────────────────────────────────

    if (data.action === 'chat_send') {
      var msg3 = data.message;
      if (!msg3 || !msg3.text) return respond({ok:false});
      var chatSheet = getOrCreateChatSheet(ss);
      chatSheet.appendRow([
        new Date(msg3.ts || Date.now()),
        msg3.sender  || '',
        msg3.role    || 'agent',
        msg3.channel || 'group',
        msg3.text    || ''
      ]);
      return respond({ok:true});
    }

    if (data.action === 'chat_fetch') {
      var sincePrivate = data.since_private || 0;
      var sinceGroup   = data.since_group   || 0;
      var fetchUser    = data.user  || '';
      var fetchRole    = data.role  || 'agent';
      var chatSheet2   = ss.getSheetByName('CHAT');
      if (!chatSheet2) return respond({private:[], group:[]});
      var chatRows = chatSheet2.getDataRange().getValues();
      var privateOut = [], groupOut = [];
      for (var ci = 1; ci < chatRows.length; ci++) {
        var tsRaw   = chatRows[ci][0];
        var sender  = chatRows[ci][1];
        var msgRole = chatRows[ci][2];
        var channel = chatRows[ci][3];
        var text    = chatRows[ci][4];
        var ts      = new Date(tsRaw).getTime();
        var msgObj  = {ts:ts, sender:sender, role:msgRole, channel:channel, text:text};
        if (channel === 'group' && ts > sinceGroup) {
          groupOut.push(msgObj);
        }
        if (channel === 'private' && ts > sincePrivate) {
          if (fetchRole === 'admin' || sender === fetchUser || msgRole === 'admin') {
            privateOut.push(msgObj);
          }
        }
      }
      return respond({private:privateOut, group:groupOut});
    }

    // ── NUEVAS ACCIONES: APROBACIÓN DNC ─────────────────────

    if (data.action === 'check_dnc_approval') {
      var approvalPhone = String(data.phone||'').replace(/\D/g,'');
      if (!approvalPhone) return respond({approval:'pending'});
      var apSheet = ss.getSheetByName('DNC_APPROVAL');
      if (!apSheet) return respond({approval:'pending'});
      var apRows = apSheet.getDataRange().getValues();
      // Scan from bottom — most recent entry wins
      for (var ai = apRows.length - 1; ai >= 1; ai--) {
        var rowPhone  = String(apRows[ai][1]||'').replace(/\D/g,'');
        var rowStatus = String(apRows[ai][2]||'pending');
        if (rowPhone === approvalPhone) {
          return respond({approval: rowStatus});
        }
      }
      return respond({approval:'pending'});
    }

    if (data.action === 'dnc_approve') {
      var apPhone    = String(data.phone||'').replace(/\D/g,'');
      var apStatus   = data.status   || 'pending';
      var apApprover = data.approver || 'supervisor';
      var apSheet2   = getOrCreateApprovalSheet(ss);
      apSheet2.appendRow([new Date(), apPhone, apStatus, apApprover]);
      return respond({ok:true, status:apStatus});
    }

    return respond({error:'unknown action'});

  } catch(err) {
    return respond({error:err.toString()});
  }
}

// ── GET: Webhook Twilio para respuestas entrantes ────────────
// Configura en Twilio: When a message comes in → URL del web app → HTTP POST
function doGet(e) {
  // Manejar reply de supervisor si viene como GET
  var body = (e.parameter.Body || '').trim().toUpperCase();
  var from = (e.parameter.From || '').replace('whatsapp:+', '');
  if (body && from) processTwilioReply(body, from);
  return ContentService.createTextOutput('OK');
}

// ── Procesar reply del supervisor por WA ─────────────────────
function processTwilioReply(text, fromNumber) {
  var isSupervisor = SUPERVISOR_NUMBERS.some(function(n) {
    return fromNumber.indexOf(n) !== -1 || n.indexOf(fromNumber) !== -1;
  });
  if (!isSupervisor) return;

  var decision = null;
  if (text.indexOf('APROBADO') === 0 || text.indexOf('APPROVED') === 0) decision = 'approved';
  else if (text.indexOf('RECHAZADO') === 0 || text.indexOf('REJECTED') === 0) decision = 'rejected';
  if (!decision) return;

  // Extraer número de teléfono del mensaje si viene: "APROBADO 3001234567"
  var phoneMatch = text.match(/\d{7,12}/);
  var targetPhone = phoneMatch ? phoneMatch[0] : null;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateApprovalSheet(ss);

  if (targetPhone) {
    sheet.appendRow([new Date(), targetPhone, decision, fromNumber]);
  } else {
    // Aprobar/rechazar la entrada pendiente más reciente
    var rows = sheet.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      if (String(rows[i][2]||'pending') === 'pending') {
        sheet.getRange(i + 1, 3).setValue(decision);
        sheet.getRange(i + 1, 4).setValue(fromNumber);
        break;
      }
    }
  }

  // Confirmar al supervisor
  var confirmMsg = decision === 'approved'
    ? 'Aprobacion registrada: ' + (targetPhone || 'ultima consulta')
    : 'Rechazo registrado: '    + (targetPhone || 'ultima consulta');
  sendToNumber(fromNumber, confirmMsg);
}

// ── Helpers ──────────────────────────────────────────────────
function getOrCreateSheet(ss, name) {
  var s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    if (name === 'SESSIONS') s.appendRow(['username','timestamp','status','token']);
  }
  return s;
}

function getOrCreateChatSheet(ss) {
  var s = ss.getSheetByName('CHAT');
  if (!s) {
    s = ss.insertSheet('CHAT');
    s.appendRow(['timestamp','sender','role','channel','text']);
  }
  return s;
}

function getOrCreateApprovalSheet(ss) {
  var s = ss.getSheetByName('DNC_APPROVAL');
  if (!s) {
    s = ss.insertSheet('DNC_APPROVAL');
    s.appendRow(['timestamp','phone','status','approver']);
  }
  return s;
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ── TEST: Ejecutar manualmente para probar CallMeBot ─────────
function testCallMeBot() {
  var resp = sendToNumber('573155062006', 'Test Energy Dashboard - CallMeBot funcionando!');
  Logger.log('Resultado: ' + resp);
}
