const palierData = [
    { points_attrib: 10, titre_palier: 'Labeller-Bronze', nb_action_requise: 10, image: 'labeller-b.jpg' },
    { points_attrib: 50, titre_palier: 'Labeller-Silver', nb_action_requise: 50, image: 'labeller-s.jpg' },
    { points_attrib: 100, titre_palier: 'Labeller-Gold', nb_action_requise: 100, image: 'labeller-g.jpg' },
    { points_attrib: 20, titre_palier: 'Commenter-Bronze', nb_action_requise: 20, image: 'commenter-b.jpg' },
    { points_attrib: 80, titre_palier: 'Commenter-Silver', nb_action_requise: 80, image: 'commenter-s.jpg' },
    { points_attrib: 200, titre_palier: 'Commenter-Gold', nb_action_requise: 200, image: 'commenter-g.jpg' },
    { points_attrib: 10, titre_palier: 'Committed-Bronze', nb_action_requise: 10, image: 'committed-b.jpg' },
    { points_attrib: 50, titre_palier: 'Committed-Silver', nb_action_requise: 50, image: 'committed-s.jpg' },
    { points_attrib: 100, titre_palier: 'Committed-Gold', nb_action_requise: 100, image: 'committed-g.jpg' },
    { points_attrib: 10, titre_palier: 'PR specialist-Bronze', nb_action_requise: 10, image: 'pr-specialist-b.jpg' },
    { points_attrib: 50, titre_palier: 'PR specialist-Silver', nb_action_requise: 50, image: 'pr-specialist-s.jpg' },
    { points_attrib: 100, titre_palier: 'PR specialist-Gold', nb_action_requise: 100, image: 'pr-specialist-g.jpg' },
    { points_attrib: 10, titre_palier: 'Reactor-Bronze', nb_action_requise: 10, image: 'reactor-b.jpg' },
    { points_attrib: 50, titre_palier: 'Reactor-Silver', nb_action_requise: 50, image: 'reactor-s.jpg' },
    { points_attrib: 100, titre_palier: 'Reactor-Gold', nb_action_requise: 100, image: 'reactor-g.jpg' }
  ];
  
  const badgesData = [
    { id_badge: 5, titre: 'Labeller', description: 'Ajout de labels' },
    { id_badge: 6, titre: 'Commenter', description: 'Ajout de commentaire' },
    { id_badge: 7, titre: 'Committed', description: 'Commit sur une PR' },
    { id_badge: 8, titre: 'PR specialist', description: 'Merge de PR' },
    { id_badge: 9, titre: 'Reactor', description: 'réaction à des commentaires' }
  ];

module.exports = {
    palierData,
    badgesData
}