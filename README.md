SkinaTech - Gestión de Inventarios
Descripción
SkinaTech es una empresa dedicada a la venta y distribución de dispositivos electrónicos en áreas como Redes, Computación y Móvil. Debido al crecimiento significativo en el mercado, la gestión de su inventario se ha vuelto compleja, por lo que se desarrolló esta aplicación web para facilitar la manipulación y consulta de información de productos.

Funcionalidades
La aplicación permite gestionar el inventario estructurado en:

Categorías

Campos: id, nombre, estado (activo/inactivo)

Cada categoría tiene una o más subcategorías y productos asociados.

Al activar o desactivar una categoría, se activan o desactivan automáticamente las subcategorías y productos asociados.

Subcategorías

Campos: id, nombre, estado (activo/inactivo), cantidad de productos asociados

Cada subcategoría pertenece a una categoría y puede tener uno o más productos asociados.

La activación o desactivación de una subcategoría afecta el estado de sus productos asociados.

Productos

Campos: id, nombre

Un producto puede estar asociado a varias subcategorías.

Gestión de Usuarios y Seguridad
Usuarios poseen:

Nombre de usuario

Contraseña

Rol (administrador o básico)

Estado (activo o inactivo)

Roles y permisos:

Administrador: Puede realizar operaciones CRUD completas en Usuarios, Categorías, Subcategorías y Productos.

Básico: Sólo puede consultar todas las secciones y editar su propia cuenta.

Restricciones:

Usuarios inactivos no pueden acceder al sistema.

Autenticación mediante login con usuario y contraseña.

Tecnologías y Librerías Utilizadas
Backend:

Laravel con Sanctum para autenticación y autorización basada en roles.

Spatie Permissions para manejo de roles y permisos.

Eloquent ORM para manejo de base de datos.

Frontend:

Angular (Standalone Components).

Angular Forms y HttpClient para manejo de formularios y llamadas API.

Librería toast para notificaciones de éxito, error y advertencia.

Manejo de rutas con protección según roles (adminGuard).

Estándares de Nomenclatura
Rutas y Endpoints:

Prefijo /api para todas las APIs RESTful.

Recursos en plural: /users, /categories, /subcategories, /products.

Endpoints especiales para perfil: /profile (solo para el usuario autenticado).

Componentes Angular:

Nombre descriptivo con sufijo Component, ejemplo: UserFormComponent, ProductFormComponent.

Archivos separados en carpetas por entidad: /users, /products, etc.

Estilos CSS vinculados por componente con nomenclatura clara.

Variables y Métodos:

En camelCase para variables y funciones en TypeScript.

Métodos CRUD nombrados con verbos claros: loadUser(), save(), cancel().

Controladores y Modelos en Laravel:

Controladores nombrados en singular con sufijo Controller, ejemplo: UserController.

Modelos nombrados en singular con PascalCase, ejemplo: User, Category.

Estructura del Proyecto

backend/
 ├── app/
 │    ├── Http/
 │    │    ├── Controllers/
 │    │    │    └── Api/
 │    │    │         ├── UserController.php
 │    │    │         ├── CategoryController.php
 │    │    │         ├── SubcategoryController.php
 │    │    │         └── ProductController.php
 │    ├── Models/
 │    │    └── User.php
 │    ├── Policies/
 │    │    └── UserPolicy.php
 ├── routes/
 │    └── api.php
frontend/
 ├── src/
 │    ├── app/
 │    │    ├── users/
 │    │    │    └── form/
 │    │    │         └── form.ts, form.html, form.css
 │    │    ├── products/
 │    │    │    └── form/
 │    │    │         └── form.ts, form.html
 │    │    ├── shared/
 │    │    │    └── toast.ts
 │    │    ├── services/
 │    │    │    └── auth.ts
 │    │    └── guards/
 │    │         └── admin-guard.ts
 ├── proxy.conf.json

 Instrucciones para desarrollo
Clonar el repositorio.

Configurar variables de entorno Laravel para la base de datos y Sanctum.

Ejecutar migraciones y seeders si los hay (php artisan migrate --seed).

Levantar servidor backend (php artisan serve).

En el frontend, instalar dependencias con npm install.

Ejecutar frontend con Angular CLI: ng serve --proxy-config proxy.conf.json.

Usar credenciales válidas para login.

Administrar inventario desde el panel.

Autor
Brayan Reina — Ingeniero de Software Bilingüe

