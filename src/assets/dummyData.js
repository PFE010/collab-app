const palierData = [
    { points_attrib: 10, titre_palier: 'Labeller-Bronze', nb_action_requise: 10, image: 'labeller-b.jpg', tier: 1 },
    { points_attrib: 50, titre_palier: 'Labeller-Silver', nb_action_requise: 50, image: 'labeller-s.jpg', tier: 2 },
    { points_attrib: 100, titre_palier: 'Labeller-Gold', nb_action_requise: 100, image: 'labeller-g.jpg', tier: 3},
    { points_attrib: 20, titre_palier: 'Commenter-Bronze', nb_action_requise: 20, image: 'commenter-b.jpg', tier: 1 },
    { points_attrib: 80, titre_palier: 'Commenter-Silver', nb_action_requise: 80, image: 'commenter-s.jpg', tier: 2 },
    { points_attrib: 200, titre_palier: 'Commenter-Gold', nb_action_requise: 200, image: 'commenter-g.jpg', tier: 3 },
    { points_attrib: 10, titre_palier: 'Committed-Bronze', nb_action_requise: 10, image: 'committed-b.jpg', tier: 1 },
    { points_attrib: 50, titre_palier: 'Committed-Silver', nb_action_requise: 50, image: 'committed-s.jpg', tier: 2 },
    { points_attrib: 100, titre_palier: 'Committed-Gold', nb_action_requise: 100, image: 'committed-g.jpg', tier: 3 },
    { points_attrib: 10, titre_palier: 'PR specialist-Bronze', nb_action_requise: 10, image: 'pr-specialist-b.jpg', tier: 1 },
    { points_attrib: 50, titre_palier: 'PR specialist-Silver', nb_action_requise: 50, image: 'pr-specialist-s.jpg', tier: 2 },
    { points_attrib: 100, titre_palier: 'PR specialist-Gold', nb_action_requise: 100, image: 'pr-specialist-g.jpg', tier: 3 },
    { points_attrib: 10, titre_palier: 'Reactor-Bronze', nb_action_requise: 10, image: 'reactor-b.jpg', tier: 1 },
    { points_attrib: 50, titre_palier: 'Reactor-Silver', nb_action_requise: 50, image: 'reactor-s.jpg', tier: 2 },
    { points_attrib: 100, titre_palier: 'Reactor-Gold', nb_action_requise: 100, image: 'reactor-g.jpg', tier: 3 }
  ];
  
  const badgesData = [
    { titre: 'Labeller', description: 'Ajout de labels', action: 'label' },
    { titre: 'Commenter', description: 'Ajout de commentaire', action: 'comment' },
    { titre: 'Committed', description: 'Commit sur une PR', action: 'commit' },
    { titre: 'PR specialist', description: 'Merge de PR', action: 'merge' },
    { titre: 'Reactor', description: 'réaction à des commentaires', action: 'react' }
  ];

module.exports = {
    palierData,
    badgesData
}