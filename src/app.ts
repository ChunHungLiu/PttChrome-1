import { AppConnection } from './app-connection';
import { AnsiParser } from './ansi-parser';
import { Connection } from './connection';
import { Page } from './page';
import { TelnetConnection } from './telnet';
import { TermModel } from './term-model';
import { TermView } from './term-view';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

interface ConnectedSite {
  site: string;
  port: number;
}

export class App {

  appConn: AppConnection;
  conn: Connection;
  view: TermView;
  model: TermModel;
  parser: AnsiParser;
  page: Page;

  connectedSite: ConnectedSite;
  idleTime = 0;

  config = {
    cols: 80,
    rows: 24,
    enableBlacklist: false,
    blacklistedUserIds: ['']
  };

  init() {
    this.page = new Page();
    this.view = new TermView(this);
    this.view.init();

    this.model = new TermModel(this);
    this.parser = new AnsiParser(this);
    this.appConn = new AppConnection();
    this.conn = new TelnetConnection(this);

    this.appConn.connectAppPort().then(() => {
      this.connect('ptt.cc');
    });
  }

  connect(url: string) {
    document.title = url;

    let port = 23;
    let site = url;
    const urlSplit = url.split(/:/g);
    if (urlSplit.length === 2) {
      site = urlSplit[0];
      port = parseInt(urlSplit[1]);
    }
    this.connectedSite = { site, port };
    this.conn.connect(url, port);
  }

}