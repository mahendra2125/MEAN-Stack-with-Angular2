import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { BlogService } from './../../../services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  message;
  messageClass;
  blogForm;
  currentUrl;
  processing = false;
  loading = true;

  blog;

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private localtion: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  updateBlogSubmit() {
    this.processing = true;
    this.blogService.updateBlog(this.blog).subscribe(data => {
      if(!data.success) {
        this.message = data.message;
        this.messageClass = 'alert alert-danger';
        this.processing = false;
      } else {
        this.message = data.message;
        this.messageClass = 'alert alert-success';
        setTimeout(() => {
          this.router.navigate(['/blog']);
        }, 2000);
      }
    });
  }

  goBack() {
    this.localtion.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = 'Blog not found';
      } else {
        this.blog = data.blog;
        this.loading = false;
      }
    });
  }

}
