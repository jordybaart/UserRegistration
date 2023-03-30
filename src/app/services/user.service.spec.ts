import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Subject, takeUntil } from 'rxjs';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let userRegistration = {
    firstName: 'jordy',
    lastName: 'baart',
    email: 'jbaart@hotmail.com'
  };
  let destroy = new Subject<void>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('can register a new user, expect http post to "https://demo-api.now.sh/users" and body is filled.', () => {
    service.register(userRegistration).pipe(takeUntil(destroy)).subscribe();

    const req = httpMock.expectOne('https://demo-api.now.sh/users');
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(userRegistration);
      req.flush(userRegistration);

    expect(service.register).toBeTruthy();
  });
});
