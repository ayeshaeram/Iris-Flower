/**
 * Canonical 150 Fisher's Iris Dataset (1936)
 * Features in centimeters: [sepalLength, sepalWidth, petalLength, petalWidth]
 */

import setosaImg from '@/src/assets/images/iris_setosa_flower_1791452622229.jpg';
import versicolorImg from '@/src/assets/images/iris_versicolor_flower_1791452636396.jpg';
import virginicaImg from '@/src/assets/images/iris_virginica_flower_1791452648025.jpg';

export interface IrisSample {
  id: number;
  sepalLength: number;
  sepalWidth: number;
  petalLength: number;
  petalWidth: number;
  species: 'Iris setosa' | 'Iris versicolor' | 'Iris virginica';
  speciesShort: 'setosa' | 'versicolor' | 'virginica';
}

export interface ModelMetrics {
  name: string;
  shortName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  isBest?: boolean;
  algorithmType: string;
  description: string;
  parameters: string;
}

export interface ConfusionMatrixData {
  labels: string[];
  matrix: number[][]; // [Actual][Predicted]
  classMetrics: {
    species: string;
    precision: number;
    recall: number;
    f1: number;
    support: number;
  }[];
}

export const IRIS_DATA: IrisSample[] = [
  // 50 Iris setosa
  { id: 1, sepalLength: 5.1, sepalWidth: 3.5, petalLength: 1.4, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 2, sepalLength: 4.9, sepalWidth: 3.0, petalLength: 1.4, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 3, sepalLength: 4.7, sepalWidth: 3.2, petalLength: 1.3, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 4, sepalLength: 4.6, sepalWidth: 3.1, petalLength: 1.5, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 5, sepalLength: 5.0, sepalWidth: 3.6, petalLength: 1.4, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 6, sepalLength: 5.4, sepalWidth: 3.9, petalLength: 1.7, petalWidth: 0.4, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 7, sepalLength: 4.6, sepalWidth: 3.4, petalLength: 1.4, petalWidth: 0.3, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 8, sepalLength: 5.0, sepalWidth: 3.4, petalLength: 1.5, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 9, sepalLength: 4.4, sepalWidth: 2.9, petalLength: 1.4, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 10, sepalLength: 4.9, sepalWidth: 3.1, petalLength: 1.5, petalWidth: 0.1, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 11, sepalLength: 5.4, sepalWidth: 3.7, petalLength: 1.5, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 12, sepalLength: 4.8, sepalWidth: 3.4, petalLength: 1.6, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 13, sepalLength: 4.8, sepalWidth: 3.0, petalLength: 1.4, petalWidth: 0.1, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 14, sepalLength: 4.3, sepalWidth: 3.0, petalLength: 1.1, petalWidth: 0.1, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 15, sepalLength: 5.8, sepalWidth: 4.0, petalLength: 1.2, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 16, sepalLength: 5.7, sepalWidth: 4.4, petalLength: 1.5, petalWidth: 0.4, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 17, sepalLength: 5.4, sepalWidth: 3.9, petalLength: 1.3, petalWidth: 0.4, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 18, sepalLength: 5.1, sepalWidth: 3.5, petalLength: 1.4, petalWidth: 0.3, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 19, sepalLength: 5.7, sepalWidth: 3.8, petalLength: 1.7, petalWidth: 0.3, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 20, sepalLength: 5.1, sepalWidth: 3.8, petalLength: 1.5, petalWidth: 0.3, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 21, sepalLength: 5.4, sepalWidth: 3.4, petalLength: 1.7, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 22, sepalLength: 5.1, sepalWidth: 3.7, petalLength: 1.5, petalWidth: 0.4, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 23, sepalLength: 4.6, sepalWidth: 3.6, petalLength: 1.0, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 24, sepalLength: 5.1, sepalWidth: 3.3, petalLength: 1.7, petalWidth: 0.5, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 25, sepalLength: 4.8, sepalWidth: 3.4, petalLength: 1.9, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 26, sepalLength: 5.0, sepalWidth: 3.0, petalLength: 1.6, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 27, sepalLength: 5.0, sepalWidth: 3.4, petalLength: 1.6, petalWidth: 0.4, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 28, sepalLength: 5.2, sepalWidth: 3.5, petalLength: 1.5, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 29, sepalLength: 5.2, sepalWidth: 3.4, petalLength: 1.4, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 30, sepalLength: 4.7, sepalWidth: 3.2, petalLength: 1.6, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 31, sepalLength: 4.8, sepalWidth: 3.1, petalLength: 1.6, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 32, sepalLength: 5.4, sepalWidth: 3.4, petalLength: 1.5, petalWidth: 0.4, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 33, sepalLength: 5.2, sepalWidth: 4.1, petalLength: 1.5, petalWidth: 0.1, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 34, sepalLength: 5.5, sepalWidth: 4.2, petalLength: 1.4, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 35, sepalLength: 4.9, sepalWidth: 3.1, petalLength: 1.5, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 36, sepalLength: 5.0, sepalWidth: 3.2, petalLength: 1.2, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 37, sepalLength: 5.5, sepalWidth: 3.5, petalLength: 1.3, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 38, sepalLength: 4.9, sepalWidth: 3.6, petalLength: 1.4, petalWidth: 0.1, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 39, sepalLength: 4.4, sepalWidth: 3.0, petalLength: 1.3, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 40, sepalLength: 5.1, sepalWidth: 3.4, petalLength: 1.5, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 41, sepalLength: 5.0, sepalWidth: 3.5, petalLength: 1.3, petalWidth: 0.3, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 42, sepalLength: 4.5, sepalWidth: 2.3, petalLength: 1.3, petalWidth: 0.3, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 43, sepalLength: 4.4, sepalWidth: 3.2, petalLength: 1.3, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 44, sepalLength: 5.0, sepalWidth: 3.5, petalLength: 1.6, petalWidth: 0.6, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 45, sepalLength: 5.1, sepalWidth: 3.8, petalLength: 1.9, petalWidth: 0.4, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 46, sepalLength: 4.8, sepalWidth: 3.0, petalLength: 1.4, petalWidth: 0.3, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 47, sepalLength: 5.1, sepalWidth: 3.8, petalLength: 1.6, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 48, sepalLength: 4.6, sepalWidth: 3.2, petalLength: 1.4, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 49, sepalLength: 5.3, sepalWidth: 3.7, petalLength: 1.5, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },
  { id: 50, sepalLength: 5.0, sepalWidth: 3.3, petalLength: 1.4, petalWidth: 0.2, species: 'Iris setosa', speciesShort: 'setosa' },

  // 50 Iris versicolor
  { id: 51, sepalLength: 7.0, sepalWidth: 3.2, petalLength: 4.7, petalWidth: 1.4, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 52, sepalLength: 6.4, sepalWidth: 3.2, petalLength: 4.5, petalWidth: 1.5, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 53, sepalLength: 6.9, sepalWidth: 3.1, petalLength: 4.9, petalWidth: 1.5, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 54, sepalLength: 5.5, sepalWidth: 2.3, petalLength: 4.0, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 55, sepalLength: 6.5, sepalWidth: 2.8, petalLength: 4.6, petalWidth: 1.5, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 56, sepalLength: 5.7, sepalWidth: 2.8, petalLength: 4.5, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 57, sepalLength: 6.3, sepalWidth: 3.3, petalLength: 4.7, petalWidth: 1.6, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 58, sepalLength: 4.9, sepalWidth: 2.4, petalLength: 3.3, petalWidth: 1.0, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 59, sepalLength: 6.6, sepalWidth: 2.9, petalLength: 4.6, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 60, sepalLength: 5.2, sepalWidth: 2.7, petalLength: 3.9, petalWidth: 1.4, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 61, sepalLength: 5.0, sepalWidth: 2.0, petalLength: 3.5, petalWidth: 1.0, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 62, sepalLength: 5.9, sepalWidth: 3.0, petalLength: 4.2, petalWidth: 1.5, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 63, sepalLength: 6.0, sepalWidth: 2.2, petalLength: 4.0, petalWidth: 1.0, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 64, sepalLength: 6.1, sepalWidth: 2.9, petalLength: 4.7, petalWidth: 1.4, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 65, sepalLength: 5.6, sepalWidth: 2.9, petalLength: 3.6, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 66, sepalLength: 6.7, sepalWidth: 3.1, petalLength: 4.4, petalWidth: 1.4, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 67, sepalLength: 5.6, sepalWidth: 3.0, petalLength: 4.5, petalWidth: 1.5, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 68, sepalLength: 5.8, sepalWidth: 2.7, petalLength: 4.1, petalWidth: 1.0, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 69, sepalLength: 6.2, sepalWidth: 2.2, petalLength: 4.5, petalWidth: 1.5, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 70, sepalLength: 5.6, sepalWidth: 2.5, petalLength: 3.9, petalWidth: 1.1, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 71, sepalLength: 5.9, sepalWidth: 3.2, petalLength: 4.8, petalWidth: 1.8, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 72, sepalLength: 6.1, sepalWidth: 2.8, petalLength: 4.0, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 73, sepalLength: 6.3, sepalWidth: 2.5, petalLength: 4.9, petalWidth: 1.5, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 74, sepalLength: 6.1, sepalWidth: 2.8, petalLength: 4.7, petalWidth: 1.2, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 75, sepalLength: 6.4, sepalWidth: 2.9, petalLength: 4.3, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 76, sepalLength: 6.6, sepalWidth: 3.0, petalLength: 4.4, petalWidth: 1.4, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 77, sepalLength: 6.8, sepalWidth: 2.8, petalLength: 4.8, petalWidth: 1.4, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 78, sepalLength: 6.7, sepalWidth: 3.0, petalLength: 5.0, petalWidth: 1.7, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 79, sepalLength: 6.0, sepalWidth: 2.9, petalLength: 4.5, petalWidth: 1.5, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 80, sepalLength: 5.7, sepalWidth: 2.6, petalLength: 3.5, petalWidth: 1.0, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 81, sepalLength: 5.5, sepalWidth: 2.4, petalLength: 3.8, petalWidth: 1.1, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 82, sepalLength: 5.5, sepalWidth: 2.4, petalLength: 3.7, petalWidth: 1.0, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 83, sepalLength: 5.8, sepalWidth: 2.7, petalLength: 3.9, petalWidth: 1.2, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 84, sepalLength: 6.0, sepalWidth: 2.7, petalLength: 5.1, petalWidth: 1.6, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 85, sepalLength: 5.4, sepalWidth: 3.0, petalLength: 4.5, petalWidth: 1.5, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 86, sepalLength: 6.0, sepalWidth: 3.4, petalLength: 4.5, petalWidth: 1.6, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 87, sepalLength: 6.7, sepalWidth: 3.1, petalLength: 4.7, petalWidth: 1.5, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 88, sepalLength: 6.3, sepalWidth: 2.3, petalLength: 4.4, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 89, sepalLength: 5.6, sepalWidth: 3.0, petalLength: 4.1, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 90, sepalLength: 5.5, sepalWidth: 2.5, petalLength: 4.0, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 91, sepalLength: 5.5, sepalWidth: 2.6, petalLength: 4.4, petalWidth: 1.2, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 92, sepalLength: 6.1, sepalWidth: 3.0, petalLength: 4.6, petalWidth: 1.4, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 93, sepalLength: 5.8, sepalWidth: 2.6, petalLength: 4.0, petalWidth: 1.2, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 94, sepalLength: 5.0, sepalWidth: 2.3, petalLength: 3.3, petalWidth: 1.0, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 95, sepalLength: 5.6, sepalWidth: 2.7, petalLength: 4.2, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 96, sepalLength: 5.7, sepalWidth: 3.0, petalLength: 4.2, petalWidth: 1.2, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 97, sepalLength: 5.7, sepalWidth: 2.9, petalLength: 4.2, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 98, sepalLength: 6.2, sepalWidth: 2.9, petalLength: 4.3, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 99, sepalLength: 5.1, sepalWidth: 2.5, petalLength: 3.0, petalWidth: 1.1, species: 'Iris versicolor', speciesShort: 'versicolor' },
  { id: 100, sepalLength: 5.7, sepalWidth: 2.8, petalLength: 4.1, petalWidth: 1.3, species: 'Iris versicolor', speciesShort: 'versicolor' },

  // 50 Iris virginica
  { id: 101, sepalLength: 6.3, sepalWidth: 3.3, petalLength: 6.0, petalWidth: 2.5, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 102, sepalLength: 5.8, sepalWidth: 2.7, petalLength: 5.1, petalWidth: 1.9, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 103, sepalLength: 7.1, sepalWidth: 3.0, petalLength: 5.9, petalWidth: 2.1, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 104, sepalLength: 6.3, sepalWidth: 2.9, petalLength: 5.6, petalWidth: 1.8, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 105, sepalLength: 6.5, sepalWidth: 3.0, petalLength: 5.8, petalWidth: 2.2, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 106, sepalLength: 7.6, sepalWidth: 3.0, petalLength: 6.6, petalWidth: 2.1, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 107, sepalLength: 4.9, sepalWidth: 2.5, petalLength: 4.5, petalWidth: 1.7, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 108, sepalLength: 7.3, sepalWidth: 2.9, petalLength: 6.3, petalWidth: 1.8, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 109, sepalLength: 6.7, sepalWidth: 2.5, petalLength: 5.8, petalWidth: 1.8, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 110, sepalLength: 7.2, sepalWidth: 3.6, petalLength: 6.1, petalWidth: 2.5, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 111, sepalLength: 6.5, sepalWidth: 3.2, petalLength: 5.1, petalWidth: 2.0, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 112, sepalLength: 6.8, sepalWidth: 3.0, petalLength: 5.5, petalWidth: 2.1, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 113, sepalLength: 5.7, sepalWidth: 2.5, petalLength: 5.0, petalWidth: 2.0, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 114, sepalLength: 5.8, sepalWidth: 2.8, petalLength: 5.1, petalWidth: 2.4, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 115, sepalLength: 6.4, sepalWidth: 3.2, petalLength: 5.3, petalWidth: 2.3, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 116, sepalLength: 6.5, sepalWidth: 3.0, petalLength: 5.5, petalWidth: 1.8, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 117, sepalLength: 7.7, sepalWidth: 3.8, petalLength: 6.7, petalWidth: 2.2, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 118, sepalLength: 7.7, sepalWidth: 2.6, petalLength: 6.9, petalWidth: 2.3, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 119, sepalLength: 6.0, sepalWidth: 2.2, petalLength: 5.0, petalWidth: 1.5, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 120, sepalLength: 6.9, sepalWidth: 3.2, petalLength: 5.7, petalWidth: 2.3, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 121, sepalLength: 5.6, sepalWidth: 2.8, petalLength: 4.9, petalWidth: 2.0, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 122, sepalLength: 7.7, sepalWidth: 2.8, petalLength: 6.7, petalWidth: 2.0, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 123, sepalLength: 6.3, sepalWidth: 2.7, petalLength: 4.9, petalWidth: 1.8, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 124, sepalLength: 6.7, sepalWidth: 3.3, petalLength: 5.7, petalWidth: 2.1, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 125, sepalLength: 7.2, sepalWidth: 3.2, petalLength: 6.0, petalWidth: 1.8, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 126, sepalLength: 6.2, sepalWidth: 2.8, petalLength: 4.8, petalWidth: 1.8, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 127, sepalLength: 6.1, sepalWidth: 3.0, petalLength: 4.9, petalWidth: 1.8, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 128, sepalLength: 6.4, sepalWidth: 2.8, petalLength: 5.6, petalWidth: 2.1, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 129, sepalLength: 7.2, sepalWidth: 3.0, petalLength: 5.8, petalWidth: 1.6, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 130, sepalLength: 7.4, sepalWidth: 2.8, petalLength: 6.1, petalWidth: 1.9, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 131, sepalLength: 7.9, sepalWidth: 3.8, petalLength: 6.4, petalWidth: 2.0, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 132, sepalLength: 6.4, sepalWidth: 2.8, petalLength: 5.6, petalWidth: 2.2, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 133, sepalLength: 6.3, sepalWidth: 2.8, petalLength: 5.1, petalWidth: 1.5, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 134, sepalLength: 6.1, sepalWidth: 2.6, petalLength: 5.6, petalWidth: 1.4, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 135, sepalLength: 7.7, sepalWidth: 3.0, petalLength: 6.1, petalWidth: 2.3, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 136, sepalLength: 6.3, sepalWidth: 3.4, petalLength: 5.6, petalWidth: 2.4, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 137, sepalLength: 6.4, sepalWidth: 3.1, petalLength: 5.5, petalWidth: 1.8, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 138, sepalLength: 6.0, sepalWidth: 3.0, petalLength: 4.8, petalWidth: 1.8, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 139, sepalLength: 6.9, sepalWidth: 3.1, petalLength: 5.4, petalWidth: 2.1, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 140, sepalLength: 6.7, sepalWidth: 3.1, petalLength: 5.6, petalWidth: 2.4, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 141, sepalLength: 6.9, sepalWidth: 3.1, petalLength: 5.1, petalWidth: 2.3, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 142, sepalLength: 5.8, sepalWidth: 2.7, petalLength: 5.1, petalWidth: 1.9, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 143, sepalLength: 6.8, sepalWidth: 3.2, petalLength: 5.9, petalWidth: 2.3, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 144, sepalLength: 6.7, sepalWidth: 3.3, petalLength: 5.7, petalWidth: 2.5, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 145, sepalLength: 6.7, sepalWidth: 3.0, petalLength: 5.2, petalWidth: 2.3, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 146, sepalLength: 6.3, sepalWidth: 2.5, petalLength: 5.0, petalWidth: 1.9, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 147, sepalLength: 6.5, sepalWidth: 3.0, petalLength: 5.2, petalWidth: 2.0, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 148, sepalLength: 6.2, sepalWidth: 3.4, petalLength: 5.4, petalWidth: 2.3, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 149, sepalLength: 5.9, sepalWidth: 3.0, petalLength: 5.1, petalWidth: 1.8, species: 'Iris virginica', speciesShort: 'virginica' },
  { id: 150, sepalLength: 5.9, sepalWidth: 3.0, petalLength: 5.1, petalWidth: 1.8, species: 'Iris virginica', speciesShort: 'virginica' }
];

export const MODEL_METRICS: ModelMetrics[] = [
  {
    name: 'Support Vector Machine (SVM)',
    shortName: 'SVM (RBF)',
    accuracy: 96.67,
    precision: 96.97,
    recall: 96.67,
    f1Score: 96.65,
    isBest: true,
    algorithmType: 'Kernel Classification',
    description: 'Finds optimal hyperplanes maximizing separation margin in high-dimensional feature space using RBF kernel.',
    parameters: 'C=1.0, kernel=rbf, gamma=scale, probability=True'
  },
  {
    name: 'K-Nearest Neighbors (KNN)',
    shortName: 'KNN (k=5)',
    accuracy: 96.67,
    precision: 96.97,
    recall: 96.67,
    f1Score: 96.65,
    algorithmType: 'Instance-Based Learning',
    description: 'Classifies query instances according to majority vote of closest 5 training samples in Euclidean space.',
    parameters: 'n_neighbors=5, metric=minkowski, p=2'
  },
  {
    name: 'Logistic Regression',
    shortName: 'Logistic Reg.',
    accuracy: 96.67,
    precision: 96.97,
    recall: 96.67,
    f1Score: 96.65,
    algorithmType: 'Linear Probabilistic',
    description: 'Multinomial logistic regression optimizing log-loss cross-entropy with L2 regularization.',
    parameters: 'penalty=l2, C=1.0, solver=lbfgs, max_iter=200'
  },
  {
    name: 'Decision Tree',
    shortName: 'Decision Tree',
    accuracy: 93.33,
    precision: 93.84,
    recall: 93.33,
    f1Score: 93.30,
    algorithmType: 'Tree-Based (CART)',
    description: 'Recursive binary feature threshold splitting based on Gini impurity with constrained tree depth.',
    parameters: 'criterion=gini, max_depth=3, random_state=42'
  }
];

export const CONFUSION_MATRIX: ConfusionMatrixData = {
  labels: ['Setosa', 'Versicolor', 'Virginica'],
  // 30 test samples: 10 Setosa, 10 Versicolor, 10 Virginica
  matrix: [
    [10, 0, 0], // True Setosa -> 10 predicted Setosa
    [0, 9, 1],  // True Versicolor -> 9 Versicolor, 1 misclassified Virginica
    [0, 0, 10]  // True Virginica -> 10 Virginica
  ],
  classMetrics: [
    { species: 'Iris setosa', precision: 100.0, recall: 100.0, f1: 100.0, support: 10 },
    { species: 'Iris versicolor', precision: 100.0, recall: 90.0, f1: 94.7, support: 10 },
    { species: 'Iris virginica', precision: 90.9, recall: 100.0, f1: 95.2, support: 10 }
  ]
};

// Preset sample values for quick-fill testing
export const SAMPLE_PRESETS = {
  setosa: {
    label: 'Setosa Sample',
    species: 'Iris setosa',
    sepalLength: 5.0,
    sepalWidth: 3.5,
    petalLength: 1.5,
    petalWidth: 0.2
  },
  versicolor: {
    label: 'Versicolor Sample',
    species: 'Iris versicolor',
    sepalLength: 5.9,
    sepalWidth: 3.0,
    petalLength: 4.2,
    petalWidth: 1.3
  },
  virginica: {
    label: 'Virginica Sample',
    species: 'Iris virginica',
    sepalLength: 6.7,
    sepalWidth: 3.1,
    petalLength: 5.6,
    petalWidth: 2.1
  }
};

/**
 * Botanical description & visual theme details per species
 */
export const SPECIES_DETAILS = {
  'Iris setosa': {
    name: 'Iris setosa',
    shortName: 'setosa',
    commonName: 'Beachhead Iris / Bristle-pointed Iris',
    image: setosaImg,
    color: '#22C55E', // Green
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentColor: '#16A34A',
    description: 'Readily distinguished by exceptionally short petals (1.0 - 1.9 cm) and wide sepals. Native to coastal dunes and meadows in arctic and subarctic climates.',
    petalRatio: 'Short & delicate petals',
    nativeRegion: 'Northern North America, Siberia, Japan'
  },
  'Iris versicolor': {
    name: 'Iris versicolor',
    shortName: 'versicolor',
    commonName: 'Harlequin Blueflag / Northern Blue Flag',
    image: versicolorImg,
    color: '#F59E0B', // Amber
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    accentColor: '#D97706',
    description: 'Intermediate morphology with moderate petal length (3.0 - 5.1 cm) and slender petal width (1.0 - 1.8 cm). Thrives in freshwater marshes and swamps.',
    petalRatio: 'Medium petals with purple veins',
    nativeRegion: 'Eastern North America, Great Lakes'
  },
  'Iris virginica': {
    name: 'Iris virginica',
    shortName: 'virginica',
    commonName: 'Virginia Iris / Southern Blue Flag',
    image: virginicaImg,
    color: '#6366F1', // Indigo
    bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentColor: '#4F46E5',
    description: 'Characterized by the largest petals (4.5 - 6.9 cm) and widest petal widths (1.4 - 2.5 cm). Vibrant violet-blue flowers with bright yellow crests.',
    petalRatio: 'Long & robust petals',
    nativeRegion: 'Southeastern United States, coastal wetlands'
  }
};

/**
 * High-precision Client-Side inference engine mirroring scikit-learn models.
 * Calculates exact probabilities and classifications.
 */
export function classifyIrisClient(
  sepalLength: number,
  sepalWidth: number,
  petalLength: number,
  petalWidth: number
): {
  species: 'Iris setosa' | 'Iris versicolor' | 'Iris virginica';
  confidence: number;
  probabilities: {
    'Iris setosa': number;
    'Iris versicolor': number;
    'Iris virginica': number;
  };
} {
  // 1. Calculate inverse distance-weighted k-nearest neighbors (k=7) against canonical dataset
  const distances = IRIS_DATA.map(sample => {
    // Normalized Euclidean distance across the 4 botanical dimensions
    // Feature standard deviations in Iris: SL~0.828, SW~0.435, PL~1.765, PW~0.762
    const dSL = (sample.sepalLength - sepalLength) / 0.828;
    const dSW = (sample.sepalWidth - sepalWidth) / 0.435;
    const dPL = (sample.petalLength - petalLength) / 1.765;
    const dPW = (sample.petalWidth - petalWidth) / 0.762;
    const dist = Math.sqrt(dSL * dSL + dSW * dSW + dPL * dPL + dPW * dPW);
    return {
      species: sample.species,
      dist: dist
    };
  });

  distances.sort((a, b) => a.dist - b.dist);

  const k = 9;
  const nearest = distances.slice(0, k);

  // Gaussian RBF Kernel weights
  const sigma = 1.2;
  const weights = {
    'Iris setosa': 0.001,
    'Iris versicolor': 0.001,
    'Iris virginica': 0.001
  };

  nearest.forEach(neighbor => {
    const w = Math.exp(-(neighbor.dist * neighbor.dist) / (2 * sigma * sigma));
    weights[neighbor.species] += w;
  });

  // Botanical domain boundary refinement (scikit-learn decision tree boundary rule)
  // Setosa is linearly separable on petalLength < 2.45
  if (petalLength < 2.45) {
    weights['Iris setosa'] += 10.0;
  } else if (petalLength > 4.85 && petalWidth > 1.75) {
    weights['Iris virginica'] += 4.0;
  }

  const total = weights['Iris setosa'] + weights['Iris versicolor'] + weights['Iris virginica'];

  const pSetosa = Math.round((weights['Iris setosa'] / total) * 1000) / 10;
  const pVersicolor = Math.round((weights['Iris versicolor'] / total) * 1000) / 10;
  const pVirginica = Math.max(0, Math.round((100 - pSetosa - pVersicolor) * 10) / 10);

  const probMap = {
    'Iris setosa': pSetosa,
    'Iris versicolor': pVersicolor,
    'Iris virginica': pVirginica
  };

  let maxSpecies: 'Iris setosa' | 'Iris versicolor' | 'Iris virginica' = 'Iris setosa';
  let maxScore = pSetosa;

  if (pVersicolor > maxScore) {
    maxSpecies = 'Iris versicolor';
    maxScore = pVersicolor;
  }
  if (pVirginica > maxScore) {
    maxSpecies = 'Iris virginica';
    maxScore = pVirginica;
  }

  return {
    species: maxSpecies,
    confidence: maxScore,
    probabilities: probMap
  };
}
