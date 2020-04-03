import { Component, OnInit, Input } from '@angular/core';
import {MoviesService} from '../movies.service';
import { Movie } from '../Movie';
import { CartService } from '../cart.service';
import {MovieDetailsComponent} from '../movie-details/movie-details.component';
import { Title } from '@angular/platform-browser';
import { Observable, Subject,of, combineLatest } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap, startWith, map
} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import { MovieDb } from '../MovieDb';
import { IMovie } from '../IMovie';
import { MultipleMovies } from '../MutipleMovies';
@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

  @Input() 
  movies: MovieDb[];
  price = 50;
  selectedMovie:Movie ={
    id:1,
    title:'Test',
    url:'',
    price:0,
    description:''
  };
  
  movies2$:Observable<MovieDb[]>;
  filteredMovies$:Observable<MovieDb[]>;
  filter: FormControl;
  filter$:Observable<string>;
  errorMessage:string;
  terms:Promise<any>;
  response:string[];
  brews:MultipleMovies[];

  constructor(private movieService:MoviesService,private cartService:CartService,
   ) {
       } 

       Testmethod(){
         return this.movieService.TestTry().subscribe((data:any)=>{
         this.brews = data.Search ;
        });

      } 

  ngOnInit(): void {
    this.Testmethod();
   
   // this.getMovies();
      //this.getMovies();
    //console.log(this.movies.length);
    this.movies2$ = this.movieService.getAllMovies();
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.filteredMovies$ = combineLatest(this.movies2$, this.filter$).pipe(
      map(([movies, filterString]) => movies.filter(movies => movies.Title.toLowerCase().indexOf(filterString.toLowerCase()) !== -1))
    );
  }

 
  getMovies(){
    this.movieService.getAllMovies().subscribe(movieData =>{
      this.movies = movieData;
      console.log('getMovieDetails:' + this.movies.length);
    },
    error => this.errorMessage = <any>error);
  }

  addToCart(movie:any,numberOfTickets:number):void{
    console.log(numberOfTickets);
    console.log(movie.Title);
    this.cartService.addToCart(movie,numberOfTickets,50);
  }

  onSelect(hero: Movie): void { 
    this.selectedMovie = hero;
  }

  getStuff(){
    
  this.terms = fetch(`http://www.omdbapi.com/?s=${'batman'}&apikey=bb401528`)
   .then(response=>response.json())
    .then(res=>this.movies=res.Search);

    console.log("here "+ this.terms.then(response=>response));
    
  }


}
