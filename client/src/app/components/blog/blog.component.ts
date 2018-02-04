import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { BlogService } from './../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  messageClass;
  messagge;
  loadingBlogs = false;
  blogForm;
  newPost = false;
  processing = false;
  username;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) {
    this.createNewBlogForm();
   }

  createNewBlogForm() {
    this.blogForm = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    });
  }

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value)) {
      return null;
    } else {
      return { 'alphaNumericValidation': true};
    }

  }

  newBlogFrom(){
    this.newPost = true;
  }

  reloadBlogs(){
    this.loadingBlogs = true;
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000);
  }

  draftComment(){
    
  }

  onBlogSubmit(){
    this.processing = true;
    this.disableNewBlogForm();

    const blog = {
      title: this.blogForm.get('title').value,
      body: this.blogForm.get('body').value,
      createdBy: this.username
    };

    this.blogService.newBlog(blog).subscribe(data => {
      console.log('data');
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.messagge = data.message;
        this.processing = false;
        this.enableNewBlogForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.messagge = data.message;
        setTimeout(() => {
          this.processing = false;
         // this.messageClass = false;
          //this.blogForm.reset();
          this.enableNewBlogForm();
        });
      }
    });
  }

  enableNewBlogForm() {
    this.blogForm.get('title').enable();
    this.blogForm.get('body').enable();
  }

  disableNewBlogForm() {
    this.blogForm.get('title').disable();
    this.blogForm.get('body').disable();
  }

  goBack(){
    window.location.reload();
  }

  ngOnInit() {
    this.authService.getProfile().subscribe((profile) => {
      this.username = profile.user.username;
    });
  }

}
