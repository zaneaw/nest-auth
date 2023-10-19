import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

// https://www.youtube.com/watch?v=bdcgBKqzEko&list=PL_cUvD4qzbkw-phjGK2qq0nQiG6gw1cKK&index=21
// 10:47 in the video