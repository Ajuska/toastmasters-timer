import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Toastmasters timer'
    );
  });

  it('should start the timer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.userMinutes = 1;
    app.startTimer();
    expect(app.timer).toBeDefined();
    expect(app.isDisabled).toBeTrue();
  });

  it('should stop the timer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.userMinutes = 1;
    app.startTimer();
    app.stopTimer();
    expect(app.timer).toBeUndefined();
    expect(app.isDisabled).toBeFalse();
  });

  it('should reset the timer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.userMinutes = 1;
    app.startTimer();
    app.resetTimer();
    expect(app.seconds).toBe(0);
    expect(app.backgroundColor).toBe('rose');
    expect(app.timer).toBeUndefined();
  });

  it('should handle keydown events', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const startOrStopSpy = spyOn(app, 'startOrStopAction');
    const resetSpy = spyOn(app, 'resetTimer');

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });

    app.handleKeyDown(spaceEvent);
    expect(startOrStopSpy).toHaveBeenCalled();

    app.handleKeyDown(escapeEvent);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should toggle seconds display', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const initialDisplaySeconds = app.displaySeconds;
    app.toggleSeconds();
    expect(app.displaySeconds).toBe(!initialDisplaySeconds);
  });

  it('should change preset and reset timer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const resetSpy = spyOn(app, 'resetTimer');
    const event = { target: { value: 'introduction' } } as unknown as Event;
    app.onPresetChange(event);
    expect(app.selectedPreset).toBe('introduction');
    expect(app.userMinutes).toBe(app.speechPresets['introduction']);
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should reset timer on time input change', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const resetSpy = spyOn(app, 'resetTimer');
    app.onTimeInputChange();
    expect(app.selectedPreset).toBe('--- Select Preset ---');
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should start wake lock', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Create a mock for navigator.wakeLock
    const mockWakeLock = {
      request: jasmine.createSpy('request').and.returnValue(
        Promise.resolve({
          release: jasmine
            .createSpy('release')
            .and.returnValue(Promise.resolve()),
        })
      ),
    };

    // Define the mock wakeLock property on navigator
    Object.defineProperty(navigator, 'wakeLock', {
      value: mockWakeLock,
      configurable: true,
    });

    await app.startWakeLock();
    expect(app.wakeLock).toBeDefined();
    expect(mockWakeLock.request).toHaveBeenCalledWith('screen');
  });

  it('should stop wake lock', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Create a mock for wakeLock with a release method
    const mockWakeLock = {
      release: jasmine.createSpy('release').and.returnValue(Promise.resolve()),
    };

    // Set the mock wakeLock on the app instance
    app.wakeLock = mockWakeLock as any;
    await app.stopWakeLock();
    expect(mockWakeLock.release).toHaveBeenCalled();
    expect(app.wakeLock).toBeNull();
  });
});
