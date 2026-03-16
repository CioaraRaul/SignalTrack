import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Vehicle } from '../state/models/vehicle.model';
import { CreateVehicleDto, UpdateVehicleDto } from '../state/models/vehicle-dto.model';
import { ApiResponse } from '../state/models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly baseUrl = `${environment.apiUrl}/vehicles`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Vehicle[]> {
    return this.http.get<ApiResponse<Vehicle[]>>(this.baseUrl).pipe(map((res) => res.data));
  }

  getById(id: string): Observable<Vehicle> {
    return this.http
      .get<ApiResponse<Vehicle>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(dto: CreateVehicleDto): Observable<Vehicle> {
    return this.http.post<ApiResponse<Vehicle>>(this.baseUrl, dto).pipe(map((res) => res.data));
  }

  update(id: string, dto: UpdateVehicleDto): Observable<Vehicle> {
    return this.http
      .patch<ApiResponse<Vehicle>>(`${this.baseUrl}/${id}`, dto)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<{ success: boolean }> {
    return this.http
      .delete<ApiResponse<{ success: boolean }>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }
}
