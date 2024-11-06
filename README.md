# Restaurant API
Se trata de una API que ofrece las operaciones de edición de menu y simula la actividad de las mesas de un restaurante.

## Prerequisitos
- Tener instalado DockerEngine o DockerDesktop (según sea linux o windows, respectivamente).

## Puesta en marcha
- `docker-compose up`: despliega los servicios necesarios para la ejecución de la API

El servicio se despliega en el puerto 4000, se puede revisar el esquema usando el Apollo Playground en la ruta http://localhost:4000/graphql

## Variables de entorno
```
DATABASE_URL=mongodb://restaurant_db:27017/restaurant
CLIENT_ENTRY_RATIO=5
CLIENT_TIMER=5000
WAITER_TIMER=5000
EATING_TIMER=5000
```