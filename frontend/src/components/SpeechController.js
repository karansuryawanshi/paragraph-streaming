const convertTextToSpeech = async (req, res) => {
  try {
    const { paragraph } = req.body;

    // Convert paragraph to speech using Deepgram
    const audioBuffer = await deepgramService.convert(paragraph);

    // Respond with the audio
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'attachment; filename="speech.mp3"',
    });
    res.send(audioBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to convert text to speech" });
  }
};

module.exports = { convertTextToSpeech };
