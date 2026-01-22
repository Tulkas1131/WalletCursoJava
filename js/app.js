// ========================================
//              FUNCIONES 
// ========================================



// Función para actualizar saldo desde localStorage con formato de moneda
function actualizarSaldo() {
  const saldo = localStorage.getItem('saldo') || '60000';
  const saldoFormato = parseFloat(saldo).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP'
  });
  $('#saldoDisplay').text(saldoFormato);
}

// Función para mostrar notificaciones con alertas Bootstrap
function mostrarNotificacion(mensaje, tipo) {
  const notifArea = $('#notificacion');
  const alerta = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
    </div>
  `;
  notifArea.html(alerta);
  setTimeout(() => {
    notifArea.html('');
  }, 3000);
}

// ========================================
// LOGIN.HTML
// ========================================

// Uso de jQuery para capturar eventos de formulario
$('#loginForm').submit(function (e) {
  e.preventDefault();

  // Selectores jQuery para obtener valores (#email.val(), #password.val())
  const usuario = $('#email').val();
  const password = $('#password').val();
  const messageArea = $('#messageArea');

  // Credenciales correctas: Admin / admin
  if (usuario === 'Admin' && password === 'admin') {
    //  Alerta Bootstrap con estilos predefinidos y botón de cierre
    const alertaExito = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>✓ ¡Bienvenido!</strong> Redirigiendo al menú principal...
        <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
      </div>
    `;
    messageArea.html(alertaExito);

    // Inicializar saldo si no existe
    if (!localStorage.getItem('saldo')) {
      localStorage.setItem('saldo', '60000');
    }
    // Inicializar transacciones vacío
    if (!localStorage.getItem('transacciones')) {
      localStorage.setItem('transacciones', JSON.stringify([]));
    }

    // Redirigir a menu.html después de 1.5 segundos (sea en index.html o login.html)
    setTimeout(() => {
      window.location.href = 'menu.html';
    }, 1500);
  } else {
    // Alerta Bootstrap de error con estilos predefinidos
    const alertaError = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>✗ Error de autenticación</strong> Las credenciales son incorrectas. Intenta de nuevo.
        <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
      </div>
    `;
    messageArea.html(alertaError);
    $('#password').val('');
  }
});

// ========================================
// MENU.HTML
// ========================================

// Eventos de botones con jQuery usando .on('click')
$('#btnDepositar').on('click', function () {
  // Leyenda de redirección con HTML enriquecido
  mostrarNotificacion('🔄 Redirigiendo a <strong>Depositar Dinero</strong>...', 'info');
  setTimeout(() => {
    window.location.href = 'deposit.html';
  }, 500);
});

$('#btnEnviar').on('click', function () {
  mostrarNotificacion('🔄 Redirigiendo a <strong>Enviar Dinero</strong>...', 'info');
  setTimeout(() => {
    window.location.href = 'sendmoney.html';
  }, 500);
});

$('#btnMovimientos').on('click', function () {
  mostrarNotificacion('🔄 Redirigiendo a <strong>Últimos Movimientos</strong>...', 'info');
  setTimeout(() => {
    window.location.href = 'transactions.html';
  }, 500);
});

// Verificación de autenticación al cargar la página con jQuery
$(window).on('load', function () {
  const saldo = localStorage.getItem('saldo');
  if (saldo === null && window.location.pathname.includes('menu.html')) {
    window.location.href = 'login.html';
  }
  if ($('#saldoDisplay').length) {
    actualizarSaldo();
  }
});

$('#btnVolverIndex').on('click', function () {
  mostrarNotificacion('🔄 Redirigiendo a la <strong>Página Principal</strong>...', 'info');
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 500);
});

// ========================================
// DEPOSIT.HTML
// ========================================

// Uso de jQuery para capturar evento submit del formulario
$('#depositForm').submit(function (e) {
  e.preventDefault();

  // Selectores jQuery para obtener valores del formulario
  const monto = parseFloat($('#depositAmount').val());
  const messageArea = $('#messageArea');
  const montoDepositadoArea = $('#montoDepositado');

  // Validación del monto ingresado
  if (isNaN(monto) || monto <= 0) {
    const alertaError = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>✗ Error</strong> Por favor ingresa un monto válido.
        <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
      </div>
    `;
    messageArea.html(alertaError);
    return;
  }

  // Obtener saldo actual
  const saldoActual = parseFloat(localStorage.getItem('saldo') || '60000');
  const nuevoSaldo = saldoActual + monto;

  // Actualizar saldo en localStorage
  localStorage.setItem('saldo', nuevoSaldo.toString());

  // Registro de transacciones en localStorage para historial
  const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
  transacciones.unshift({
    tipo: 'Depósito',
    monto: monto,
    fecha: new Date().toLocaleString('es-AR'),
    icono: '💵'
  });
  localStorage.setItem('transacciones', JSON.stringify(transacciones));

  // Alerta Bootstrap de éxito con detalles del depósito
  const alertaExito = `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>✓ ¡Depósito Exitoso!</strong>
      <br>Monto depositado: <strong>$${monto.toFixed(2)}</strong>
      <br>Nuevo saldo: <strong>$${nuevoSaldo.toFixed(2)}</strong>
      <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
    </div>
  `;
  messageArea.html(alertaExito);

  // Leyenda visible del monto depositado debajo del formulario
  const leyendaDeposito = `
    <div class="alert alert-primary">
      💵 <strong>Monto depositado:</strong> $${monto.toFixed(2)}
    </div>
  `;
  montoDepositadoArea.html(leyendaDeposito);

  $('#depositAmount').val('');

  // Redirección después de 2 segundos con setTimeout
  setTimeout(() => {
    window.location.href = 'menu.html';
  }, 2000);
});

// Registro de transacciones en localStorage para historial
function registrarTransaccion(tipo, monto, icono, contacto = null) {
  const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
  transacciones.unshift({
    tipo: tipo,
    monto: monto,
    fecha: new Date().toLocaleString('es-AR'),
    icono: icono,
    contacto: contacto
  });
  localStorage.setItem('transacciones', JSON.stringify(transacciones));
}

// ========================================
// SENDMONEY.HTML
// ========================================

let contactoActual = null;
let contactosFiltrados = [];

// Función para inicializar contactos por defecto en localStorage
function inicializarContactos() {
  if (!localStorage.getItem('contactos')) {
    const contactosDefault = [
      { nombre: 'Juan Perez', numCuenta: '1234567890123456789012', alias: 'vista', banco: 'Banco Chile' },
      { nombre: 'Maria Gonzales', numCuenta: '9876543210987654321098', alias: 'corriente', banco: 'Banco Itau' }
    ];
    localStorage.setItem('contactos', JSON.stringify(contactosDefault));
  }
}

// Función para mostrar y filtrar contactos en tiempo real
function mostrarContactos(filtro = '') {
  const contactos = JSON.parse(localStorage.getItem('contactos') || '[]');
  const listContainer = $('#contactList');

  // Búsqueda filtrando por nombre usando toLowerCase()
  contactosFiltrados = contactos.filter(contacto => {
    const nombre = contacto.nombre.toLowerCase();
    const busqueda = filtro.toLowerCase();
    return nombre.includes(busqueda);
  });

  if (contactosFiltrados.length === 0) {
    listContainer.html('<p class="text-muted">No hay contactos que coincidan con la búsqueda.</p>');
    return;
  }

  let html = '';
  contactosFiltrados.forEach((contacto, index) => {
    html += `
      <div class="list-group-item">
        <div class="contact-info">
          <span class="contact-name">👤 ${contacto.nombre}</span>
          <span class="contact-details">
            <strong>Número de Cuenta:</strong> ${contacto.numeroDeCuenta || contacto.cbu} | <strong>Tipo:</strong> ${contacto.alias} | <strong>Banco:</strong> ${contacto.banco}
          </span>
          <!-- Botón dinámico con data-index para identificar el contacto -->
          <button type="button" class="btn btn-primary btn-sm mt-2" data-index="${index}">✓ Enviar Dinero</button>
        </div>
      </div>
    `;
  });
  listContainer.html(html);

  // Evento para abrir modal de envío con índice del contacto
  $('.btn-primary', listContainer).on('click', function () {
    const index = $(this).attr('data-index');
    abrirModalEnvio(index);
  });
}

// Evento keyup para búsqueda en tiempo real de contactos
$('#searchContact').on('keyup', function () {
  const filtro = $(this).val();
  mostrarContactos(filtro);
});

// Evento para mostrar modal de agregar contacto con jQuery
$('#btnAgregarContacto').on('click', function () {
  $('#formNuevoContacto')[0].reset();
  $('#formErrors').html('');
  $('#modalContacto').modal('show');
});

// Validación completa de formulario antes de agregar contacto
$('#formNuevoContacto').submit(function (e) {
  e.preventDefault();

  const nombre = $('#nombreApellido').val().trim();
  const numeroDeCuenta = $('#numeroDeCuenta').val().trim();
  const alias = $('#alias').val();
  const banco = $('#banco').val().trim();
  const formErrors = $('#formErrors');

  // Validación de nombre obligatorio
  if (!nombre) {
    formErrors.html('<div class="alert alert-danger">✗ El nombre es obligatorio.</div>');
    return;
  }

  // Validación de Número de Cuenta obligatorio
  if (!numeroDeCuenta) {
    formErrors.html('<div class="alert alert-danger">✗ El número de Cuenta es obligatorio.</div>');
    return;
  }

  // Validación de formato Número de Cuenta (22 dígitos) con regex
  if (!/^\d{22}$/.test(numeroDeCuenta)) {
    formErrors.html('<div class="alert alert-danger">✗ El número de Cuenta debe contener 22 dígitos.</div>');
    return;
  }

  // Validación de tipo de cuenta seleccionado
  if (!alias) {
    formErrors.html('<div class="alert alert-danger">✗ Debe seleccionar un tipo de cuenta.</div>');
    return;
  }

  // Validación de nombre del banco obligatorio
  if (!banco) {
    formErrors.html('<div class="alert alert-danger">✗ El nombre del banco es obligatorio.</div>');
    return;
  }

  // Guardar nuevo contacto en localStorage
  const contacto = {
    nombre: nombre,
    numeroDeCuenta: numeroDeCuenta,
    alias: alias,
    banco: banco
  };

  const contactos = JSON.parse(localStorage.getItem('contactos') || '[]');
  contactos.push(contacto);
  localStorage.setItem('contactos', JSON.stringify(contactos));

  // Alerta Bootstrap de éxito al agregar contacto
  $('#messageArea').html(`
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>✓ Éxito</strong> Contacto agregado exitosamente.
      <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
    </div>
  `);

  $('#modalContacto').modal('hide');
  mostrarContactos();

  setTimeout(() => {
    $('#messageArea').html('');
  }, 3000);
});

// Función para abrir modal de envío con contacto seleccionado
function abrirModalEnvio(index) {
  const contactos = JSON.parse(localStorage.getItem('contactos') || '[]');
  contactoActual = contactos[index];
  $('#contactoSeleccionado').text(contactoActual.nombre);
  $('#montoEnvio').val('');
  $('#envioErrors').html('');
  $('#modalEnviar').modal('show');
}

// Validación y procesamiento de envío de dinero
$('#formEnviarDinero').submit(function (e) {
  e.preventDefault();

  const monto = parseFloat($('#montoEnvio').val());
  const saldoActual = parseFloat(localStorage.getItem('saldo') || '60000');
  const envioErrors = $('#envioErrors');

  // Validación de monto ingresado
  if (isNaN(monto) || monto <= 0) {
    envioErrors.html('<div class="alert alert-danger">✗ Ingresa un monto válido.</div>');
    return;
  }

  // Validación de saldo suficiente
  if (monto > saldoActual) {
    envioErrors.html('<div class="alert alert-danger">✗ Saldo insuficiente para realizar esta transferencia.</div>');
    return;
  }

  // Actualizar saldo después de transferencia
  const nuevoSaldo = saldoActual - monto;
  localStorage.setItem('saldo', nuevoSaldo.toString());

  // Registrar transacción en localStorage para historial
  const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
  transacciones.unshift({
    tipo: 'Envío de dinero',
    monto: monto,
    contacto: contactoActual.nombre,
    fecha: new Date().toLocaleString('es-AR'),
    icono: '📤'
  });
  localStorage.setItem('transacciones', JSON.stringify(transacciones));

  // Mensaje de confirmación con Bootstrap alert
  $('#messageArea').html(`
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>✓ ¡Transferencia Exitosa!</strong>
      <br>Se envió $${monto.toFixed(2)} a <strong>${contactoActual.nombre}</strong>
      <button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>
    </div>
  `);

  $('#modalEnviar').modal('hide');
  this.reset();

  // Redirección a menú después de 2 segundos
  setTimeout(() => {
    window.location.href = 'menu.html';
  }, 2000);
});

// Inicializar contactos y mostrar lista al cargar la página
$(window).on('load', function () {
  if ($('#contactList').length) {
    inicializarContactos();
    mostrarContactos();
  }
});

// ========================================
// TRANSACTIONS.HTML
// ========================================

// Lista ficticia de transacciones por defecto para demostración
const listaTransaccionesDefault = [
  {
    tipo: 'Depósito',
    monto: 5000,
    fecha: new Date(Date.now() - 86400000).toLocaleString('es-AR'),
    icono: '💵'
  },
  {
    tipo: 'Envío de dinero',
    monto: 1500,
    contacto: 'Carlos López',
    fecha: new Date(Date.now() - 172800000).toLocaleString('es-AR'),
    icono: '📤'
  },
  {
    tipo: 'Transferencia recibida',
    monto: 3000,
    contacto: 'María García',
    fecha: new Date(Date.now() - 259200000).toLocaleString('es-AR'),
    icono: '📥'
  }
];

// Función para obtener tipo de transacción formateado con emojis
function getTipoTransaccion(tipo) {
  const tipos = {
    'Depósito': '💵 Depósito',
    'Envío de dinero': '📤 Envío de dinero',
    'Transferencia recibida': '📥 Transferencia recibida'
  };
  return tipos[tipo] || tipo;
}

// Función para mostrar transacciones filtradas dinámicamente
function mostrarUltimosMovimientos(filtro = '') {
  const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');

  // Combinar transacciones guardadas con las ficticias por defecto
  const todasLasTransacciones = [...listaTransaccionesDefault, ...transacciones];

  // Filtrar por tipo de transacción si se especifica
  const transaccionesFiltradas = filtro
    ? todasLasTransacciones.filter(trans => trans.tipo === filtro)
    : todasLasTransacciones;

  const container = $('#transactionList');

  if (transaccionesFiltradas.length === 0) {
    container.html('<p class="p-5 text-muted text-center">No hay movimientos registrados de este tipo.</p>');
    return;
  }

  let html = '';
  transaccionesFiltradas.forEach(trans => {
    // Determinar si la transacción es positiva o negativa para estilo
    const esPositivo = trans.tipo === 'Depósito' || trans.tipo === 'Transferencia recibida';
    const claseMonto = esPositivo ? 'amount-positive' : 'amount-negative';
    const signo = esPositivo ? '+' : '-';

    html += `
      <div class="transaction-item">
        <div>
          <span class="transaction-icon">${trans.icono}</span>
          <div>
            <!-- Mostrar tipo de transacción con formato legible -->
            <span class="transaction-description">${getTipoTransaccion(trans.tipo)}</span>
            ${trans.contacto ? `<br><small class="text-muted">De/Para: ${trans.contacto}</small>` : ''}
            <br><small class="text-muted">${trans.fecha}</small>
          </div>
        </div>
        <!-- Mostrar monto con signo y color según si es entrada o salida -->
        <span class="transaction-amount ${claseMonto}">${signo} $${trans.monto.toFixed(2)}</span>
      </div>
    `;
  });

  container.html(html);
}

// Evento change del selector para filtrar transacciones en tiempo real
$('#filtroTransacciones').on('change', function () {
  const filtro = $(this).val();
  mostrarUltimosMovimientos(filtro);
});

// Inicializar y mostrar transacciones al cargar la página
$(window).on('load', function () {
  if ($('#transactionList').length) {
    mostrarUltimosMovimientos();
  }
});
