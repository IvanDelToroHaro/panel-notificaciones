type NivelAlerta = 'info' | 'warning' | 'error';

interface Notificacion {
  id: number;
  mensaje: string;
  nivel: NivelAlerta;
  leida: boolean;
}

let notificaciones: Notificacion[] = [
  {
    id: 1,
    mensaje: 'La aplicación se ha iniciado correctamente.',
    nivel: 'info',
    leida: false,
  },
  {
    id: 2,
    mensaje: 'Tu sesión está a punto de caducar.',
    nivel: 'warning',
    leida: false,
  },
  {
    id: 3,
    mensaje: 'No se pudo guardar el último cambio.',
    nivel: 'error',
    leida: false,
  },
];

const contenedor = document.querySelector<HTMLElement>(
  '#contenedor-notificaciones',
);

if (!contenedor) {
  throw new Error('No se encontró el contenedor de notificaciones.');
}

const elementoContenedor: HTMLElement = contenedor;

function renderizarNotificaciones(): void {
  const tarjetas = notificaciones.map((notificacion) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = [
      'notificacion',
      `notificacion--${notificacion.nivel}`,
      ...(notificacion.leida ? ['notificacion--leida'] : []),
    ].join(' ');

    const mensaje = document.createElement('p');
    mensaje.textContent = notificacion.mensaje;

    const estado = document.createElement('p');
    estado.textContent = notificacion.leida ? 'Leída' : 'Pendiente';

    const acciones = document.createElement('div');
    acciones.className = 'acciones';

    const botonMarcar = document.createElement('button');
    botonMarcar.type = 'button';
    botonMarcar.textContent = 'Marcar leída';
    botonMarcar.dataset.accion = 'marcar';
    botonMarcar.dataset.id = String(notificacion.id);
    botonMarcar.disabled = notificacion.leida;

    const botonEliminar = document.createElement('button');
    botonEliminar.type = 'button';
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.dataset.accion = 'eliminar';
    botonEliminar.dataset.id = String(notificacion.id);

    acciones.append(botonMarcar, botonEliminar);
    tarjeta.append(mensaje, estado, acciones);
    return tarjeta;
  });

  elementoContenedor.replaceChildren(...tarjetas);
}

elementoContenedor.addEventListener('click', (event: MouseEvent) => {
  const elementoPulsado = event.target as HTMLElement | null;
  const boton = elementoPulsado?.closest<HTMLButtonElement>(
    'button[data-accion][data-id]',
  );

  if (!boton || !elementoContenedor.contains(boton)) {
    return;
  }

  const id = Number(boton.dataset.id);
  if (!Number.isInteger(id)) {
    return;
  }

  if (boton.dataset.accion === 'marcar') {
    notificaciones = notificaciones.map((notificacion) =>
      notificacion.id === id
        ? { ...notificacion, leida: true }
        : notificacion,
    );
    renderizarNotificaciones();
  } else if (boton.dataset.accion === 'eliminar') {
    notificaciones = notificaciones.filter(
      (notificacion) => notificacion.id !== id,
    );
    renderizarNotificaciones();
  }
});

renderizarNotificaciones();
