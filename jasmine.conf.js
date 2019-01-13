import Jasmine from 'jasmine';
import { SpecReporter } from 'jasmine-spec-reporter';

const jasmine = new Jasmine();
const deep = process.argv.slice(2)[0] === 'deep';
const err = process.argv.slice(2)[0] === 'err';

jasmine.loadConfig({
  spec_dir: 'tests',
  spec_files: [
    '*.js'
  ],
  helpers: [
    'helpers/*.js'
  ],
});

jasmine.clearReporters();
jasmine.addReporter(new SpecReporter({
  spec: {
    displayErrorMessages: false,
    displayStacktrace: true,
    displaySuccessful: !deep && !err,
    displayFailed: true,
    displayPending: true,
    displayDuration: false
  },
  summary: {
    displayErrorMessages: deep,
    displayStacktrace: deep,
    displaySuccessful: false,
    displayFailed: deep,
    displayPending: false,
    displayDuration: true
  }
}));

jasmine.execute();