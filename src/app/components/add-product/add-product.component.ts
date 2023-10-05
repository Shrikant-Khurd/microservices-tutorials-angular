import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IMainCategory } from 'src/app/utility/IMainCategory';
import { ISecondaryCategory } from 'src/app/utility/ISecondaryCategory';
import { ISubCategory } from 'src/app/utility/ISubCategory';
import { ProductApiService } from 'src/app/utility/product-api.service';
import { ProductService } from 'src/app/utility/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styles: [`
   .selected-size{
    border: 2px solid #2874f0!important;
    color: #2874f0!important;
    box-shadow: none;
  }
  .btn-size {
    font-size: 18px;
    color: #212121;
    min-width: 48px;
    height: 40px;
    text-align: center;
    border-radius: 0px;
  }`
  ]
})
export class AddProductComponent implements OnInit {

  sizes: string[] = ['S', 'M', 'L', 'XL', 'XXL'];
  sizeInNumbers: string[] = ['30', '32', '34', '36', '38'];
  selectSizeD: string[] = ['Sizes', 'Size In Numbers'];
  selSizeString:string | undefined;

  sizeeee:string[]=[];

  selectedSizes: { [size: string]: boolean } = {};
  mainCategories: IMainCategory[] = [];
  subCategories: ISubCategory[] = [];
  secondaryCategories: ISecondaryCategory[] = [];

  selectedMainCategory: number | undefined;
  selectedSubCategory: number | undefined;
  selectedSecondaryCategory: number | undefined;

  apiResponse: any;
  msg: string = "";
  products: any;
  categories: any;
  selectedFile: File | null = null;

  constructor(private _fb: FormBuilder,
    private _productService: ProductService,
    private _service: ProductApiService,
    private _router: Router
  ) {
    // this._router.routeReuseStrategy.shouldReuseRoute = () => false;
  }



  // // Function triggered when main category changes
  // onMainCategoryChange2() {
  //   this.subCategories = this.mainCategories.filter(
  //     (subCategory) => subCategory.categoryId === this.selectedMainCategory
  //   );
  //   this.selectedSubCategory = null;
  //   this.secondaryCategories = [];
  // }

  // toggleSize(size: string): void {
  //   this.selectedSizes[size] = !this.selectedSizes[size];
  // }
  selectedSize: string[] = [];

  toggleSize(size: string): void {
    if (this.selectedSize.includes(size)) {
      this.selectedSize = this.selectedSize.filter(s => s !== size);
    } else {
      this.selectedSize.push(size);
    }
  }
  loadMainCategories(): void {
    this._service.allCategories().subscribe(data => {
      this.mainCategories = data;
      console.log(this.mainCategories);
      console.log(this.subCategories);
    });
  }

  onMainCategoryChange(): void {
    this.selectedSubCategory = undefined;
    this.selectedSecondaryCategory = undefined
    console.log('Selected Main Category:', this.selectedMainCategory);
    if (this.selectedMainCategory) {
      this.loadSubCategories(this.selectedMainCategory);
      // this.selectedSubCategory = undefined
    }
  }

  loadSubCategories(mainCategoryId: number): void {
    this._service.getSubCategories(mainCategoryId).subscribe(data => {
      this.apiResponse = data;
      this.subCategories = this.apiResponse.data;
      console.log("loadSubCategories : ", this.subCategories);
    });
  }

  onSubCategoryChange(): void {
   
    this.selectedSecondaryCategory = undefined
    if (this.selectedSubCategory) {
      this.loadSecondaryCategories(this.selectedSubCategory);
    }
    console.log('Selected sub Category:', this.selectedSubCategory);
  }

  loadSecondaryCategories(subCategoryId: number): void {
    // console.log('Selected secondary Category:', this.selectedSecondaryCategory);
    this._service.getSecondaryCategories(subCategoryId).subscribe(data => {
      this.apiResponse = data;
      this.secondaryCategories = this.apiResponse.data;
      console.log("loadSecondaryCategories : ", this.secondaryCategories);

      if (this.secondaryCategories.length == 0) {
        console.log("Nooooo jdsvhsb");
        // this.selectedSubCategory = undefined
      }
    });
    
    
  }

  onSizeChange(): void {
    console.log(this.selSizeString);
    if (this.selSizeString==="Sizes") {
      this.sizeeee=this.sizes;
    }
    if (this.selSizeString==="Size In Numbers") {
      this.sizeeee=this.sizeInNumbers;
    }
    console.log('Selected sizeee :', this.sizeeee);
  }

  addProductForm: FormGroup = this._fb.group({

    productName: ['', Validators.required],
    description: ['', Validators.required],
    mainCategory: ['', Validators.required],
    subCategory: ['', Validators.required],
    secondaryCategory: [''],
    sizes: [],
    selectSizes: [],
    price: ['', Validators.required],
    quantityInStock: ['', Validators.required]
    // image: [null, Validators.required]
  }
  );
  ngOnInit(): void {
    // this._service.getData().subscribe(data=>{console.log(data);this.products=data});
    this._service.allCategories().subscribe(data => {
      this.categories = data;
      console.log(this.categories);

    });
    this.loadMainCategories();
    console.log(this.selSizeString);
  }

  addProduct() {

    // console.log(this.addProductForm.value);
    // this._productService.addProduct(this.addProductForm.value);
    //  this._router.navigate(['/movies']);

    this._service.addProduct(this.addProductForm.value).subscribe(response => { console.log(response); this.msg = response },
      error => { console.log("Error" + error.message) }, () => console.log("Operation Completed"));

    //this._router.navigate(['/products']);
    /* let currentUrl = this._router.url;
     this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
         this._router.navigate(['/products']);
     });*/
    setTimeout(() => {

      this._router.navigate(['/products']);
    }, 1000);

  }

  imageUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      // Create a FileReader to read the selected image
      const reader = new FileReader();

      // Set the event handler when the FileReader has finished loading the image
      reader.onload = (e) => {
        this.imageUrl = e.target?.result || null; // Store the base64 URL of the image or null if not found
      };

      // Read the selected image as a data URL (base64)
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.imageUrl = null; // Clear the image preview if no image is selected
    }
  }

  addProduct1() {
    console.log(this.addProductForm.value);
    const productData = this.addProductForm.value;
    // const selectedSizeArray = Object.keys(this.selectedSizes).filter(size => this.selectedSizes[size]);
    productData.sizes = this.selectedSize;
    console.log(this.selectedSize);

    const formData = new FormData();
    formData.append('productName', productData.productName);
    formData.append('description', productData.description);
    formData.append('mainCategory', productData.mainCategory);
    formData.append('subCategory', productData.subCategory);
    formData.append('secondaryCategory', productData.secondaryCategory);
    formData.append('sizes', productData.sizes);
    formData.append('price', productData.price);
    formData.append('quantityInStock', productData.quantityInStock);
    formData.append('image', this.selectedFile as File);



    this._service.addProductMongo(formData).subscribe(
      response => {
        this.msg = response;
        var json = JSON.parse(response);
        console.log(json);
        this.msg = json.message;
        console.log(this.msg);
        alert(this.msg);

      },
      error => {
        console.log('Error: ' + error.message);
      }
    );
    setTimeout(() => {

      this._router.navigate(['/products']);
    }, 1000);

  }




}
