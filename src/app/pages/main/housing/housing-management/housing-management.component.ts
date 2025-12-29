import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HousingService } from '../../../service/housing.service';
import { HouseSummary } from '../../../interfaces/house.interface';

@Component({
  selector: 'app-housing-management',
  templateUrl: './housing-management.component.html',
  styleUrls: ['./housing-management.component.css'],
})
export class HousingManagementComponent implements OnInit {
  houses: HouseSummary[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private housingService: HousingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHouses();
  }

  loadHouses(): void {
    this.loading = true;
    this.error = null;

    this.housingService.getAllHouses().subscribe({
      next: houses => {
        this.houses = houses;
        this.loading = false;
      },
      error: error => {
        console.error('Error loading houses:', error);
        this.error = 'Failed to load houses. Please try again.';
        this.loading = false;
      },
    });
  }

  viewHouseDetails(houseId: string): void {
    this.router.navigate(['/housing', houseId]);
  }

  addNewHouse(): void {
    this.router.navigate(['/housing/new']);
  }

  getFullAddress(house: HouseSummary): string {
    const { street, city, state, zip } = house.address;
    return `${street}, ${city}, ${state} ${zip}`;
  }
}
