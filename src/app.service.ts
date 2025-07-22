import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from './generated/i18n.generated';

@Injectable()
export class AppService {
  constructor(private i18n: I18nService<I18nTranslations>) {}

  getHello(): string {
    return this.i18n.t('users.hello');
  }
}
