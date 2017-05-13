<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Tone.Editor Example</title>
  </head>
  <body>

    <script src="Tone.min.js" charset="utf-8"></script>

    <!-- include ToneEditor.js after Tone.js -->
    <script src="../build/Tone-Editor.js" charset="utf-8"></script>

    <script type="text/javascript">
      var reverb = new Tone.Freeverb({
          "roomSize": 0.7,
          "dampening": 4300
      }).toMaster()

      var synth = new Tone.MonoSynth({
        oscillator: {
          type: "square"
        },
        filter: {
          Q: 2,
          type: "lowpass",
          rolloff: -12
        },
        envelope: {
          attack: .005,
          decay: 1,
          sustain: 0,
          release: .45
        },
        filterEnvelope: {
          attack: .001,
          decay: .1,
          sustain: .8,
          release: .3,
          baseFrequency: 300,
          octaves: 3.2
        }
      }).connect(reverb)

      var synthPart = new Tone.Sequence(function(time, note){
      	synth.triggerAttackRelease(note, "16n", time);
      }, ["C2", ["C3", ["C3", "D2"]], "E2", ["D2", "A1"]]).start(0);

      Tone.Transport.start("+0.1");

      // Tone.Transport.loop = true

      ToneEditor.add({
        'synth': synth,
        'reverb': reverb,
      }).options({
        log: true,
        minify: true,
        align: 'right'
      })
      .master()
      .transport()

    </script>
  </body>
</html>
