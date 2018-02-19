import { Injectable } from '@angular/core';

@Injectable()
export class Dict {
  private static dict = {
    "PT" : {
      'title': 'EMF Exposure',
      'base_station': 'Estação Radio Base',
      'state': 'Estado',
      'city': 'Cidade',
      'settings': 'Ajustes',
      'probe_height': 'Altura da sonda',
      'circle_radius': 'Raio do círculo',
      'probe': 'Sonda',
      'height': 'Altura',
      'latitude': 'Latitude',
      'longitude': 'Longitude',
      'frequency': 'Frequência',
      'tilt': 'Tilt',
      'vertical_bw': 'Ângulo de meia pot. (V)',
      'eirp': 'EIRP',
      'sidelobe_envelope': 'Nível lóbulos sec.',
      'load': 'Carregar',
      'total_exposure_ratio': 'Taxa de exposição total',
      'title_eval_multiple_probes': 'Avaliar em múltiplos pontos',
      'multiple_probes_placeholder': 'Uma sonda por linha (latitude longitude altura)',
      'calculate': 'Calcular',
      'invalid_probe': 'Sonda inválida',
      'show_ter_on_map': 'Mostrar no mapa',
      'instructions': 'Instruções: Carregue as estações radio base de uma localidade e clique no mapa para verificar a taxa de exposição total naquele ponto devido às estações radio base carregadas.'
    },
    "EN" : {
      'title': 'EMF Exposure',
      'base_station': 'Base Station',
      'state': 'State',
      'city': 'City',
      'settings': 'Settings',
      'probe_height': 'Probe height',
      'circle_radius': 'Circle radius',
      'probe': 'Probe',
      'height': 'Height',
      'latitude': 'Latitude',
      'longitude': 'Longitude',
      'frequency': 'Frequency',
      'tilt': 'Tilt',
      'vertical_bw': 'Half power bw. (V)',
      'eirp': 'EIRP',
      'sidelobe_envelope': 'Sidelobe envelope.',
      'load': 'Load',
      'total_exposure_ratio': 'Total exposure ratio',
      'title_eval_multiple_probes': 'Eval multiple probes',
      'multiple_probes_placeholder': 'One probe per line (latitude longitude height)',
      'calculate': 'Calculate',
      'invalid_probe': 'Invalid probe',
      'show_ter_on_map': 'Show on map',
      'instructions': 'Instructions: Load the base stations of some location. Then, click on the map to calculate the total exposure ratio due to the loaded base stations.'
    }
  };

  static getDict(language: string) {
    let dict = Dict.dict[language];
    if (dict === undefined)
      dict = Dict.dict["PT"];
    return dict;
  }

}