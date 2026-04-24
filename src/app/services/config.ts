import { Injectable } from '@angular/core';
import { RemoteConfig, getValue, fetchAndActivate } from '@angular/fire/remote-config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private remoteConfig: RemoteConfig) {
    // Esto hace que la app busque cambios en Firebase cada 10 segundos
    this.remoteConfig.settings.minimumFetchIntervalMillis = 10000;
  }

  /**
   * Método para saber si se puede mostrar el botón de eliminar
   */
  async canDelete(): Promise<boolean> {
    try {
      // 1. Trae los valores actuales de la nube y los activa
      await fetchAndActivate(this.remoteConfig);

      // 2. Obtiene el valor de la clave que creamos en la consola
      const value = getValue(this.remoteConfig, 'mostrar_eliminar');

      // 3. Lo devuelve como un booleano (true/false)
      return value.asBoolean();
    } catch (error) {
      console.error('Error al obtener Remote Config:', error);
      return true;
    }
  }
}
