import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Game } from '../models/game';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnChanges, OnDestroy {

  @Input() recordsPerPage = 0;
  games!: Game[];
  curentIndex: number = 0;
  pageNo: number = 1;
  sub$!: Subscription;

  constructor(private gameSvc: GameService) {}

  ngOnInit(): void {
    if (this.recordsPerPage == null) {
      this.recordsPerPage = 5;
    } else {
      this.sub$ = this.gameSvc.getGames(this.recordsPerPage, this.curentIndex)
                              .subscribe((result: any) => {
                                this.games = result.games;
                              });
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recordsPerPage'].currentValue == null) {
      this.recordsPerPage = 5;
    } else {
      this.recordsPerPage = changes['recordsPerPage'].currentValue;
    }

    this.gameSvc.getGames(this.recordsPerPage, this.curentIndex)
                .subscribe((result: any) => {
                  this.games = result.games;
                })
  }

  previousPage() {
    this.pageNo--;
    this.curentIndex = this.curentIndex - this.recordsPerPage;

this.gameSvc.getGames(this.recordsPerPage, this.curentIndex)
            .subscribe((result: any) => {
              this.games = result.games;
            })
  }

  nextPage() {
    this.pageNo++;
    this.curentIndex = this.curentIndex + this.recordsPerPage;

    this.gameSvc.getGames(this.recordsPerPage, this.curentIndex)
                .subscribe((result: any) => {
                  this.games = result.games;
                })
  }

  private fetchData(pagePerRec: number, currentIndex: number) {

  }
}
